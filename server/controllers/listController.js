const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const ListItem = require('../models/ListItem');
const Agent = require('../models/Agent');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = './uploads';
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /csv|xlsx|xls/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only CSV, XLSX and XLS files are allowed!'));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB max file size
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file');

// @desc    Upload file and distribute list
// @route   POST /api/lists/upload
// @access  Private/Admin
exports.uploadList = asyncHandler(async (req, res, next) => {
  // Check if there are active agents
  const agentCount = await Agent.countDocuments({ createdBy: req.user.id });
  
  if (agentCount === 0) {
    return next(
      new ErrorResponse('Please add some agents before uploading lists', 400)
    );
  }

  // Handle file upload
  upload(req, res, async function(err) {
    if (err) {
      return next(new ErrorResponse(`${err.message}`, 400));
    }

    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    try {
      // Parse file
      const items = await parseFile(req.file);
      
      // Validate data
      const validationError = validateItems(items);
      if (validationError) {
        // Remove the uploaded file
        fs.unlinkSync(req.file.path);
        return next(new ErrorResponse(validationError, 400));
      }

      // Get all agents
      const agents = await Agent.find({ createdBy: req.user.id });
      
      if (agents.length === 0) {
        return next(
          new ErrorResponse('No agents found to distribute the list', 404)
        );
      }

      // Distribute items among agents
      const distributedItems = distributeItems(items, agents, req.user.id);

      // Save to database
      await ListItem.insertMany(distributedItems);

      // Remove the uploaded file
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        success: true,
        count: distributedItems.length,
        data: distributedItems
      });
    } catch (error) {
      console.error(error);
      return next(
        new ErrorResponse('Error processing file. Please check format.', 500)
      );
    }
  });
});

// @desc    Get all list items
// @route   GET /api/lists
// @access  Private/Admin
exports.getLists = asyncHandler(async (req, res, next) => {
  const listItems = await ListItem.find({ createdBy: req.user.id })
    .populate({
      path: 'assignedTo',
      select: 'name email phone'
    });

  res.status(200).json({
    success: true,
    count: listItems.length,
    data: listItems
  });
});

// @desc    Get list items by agent
// @route   GET /api/lists/agent/:agentId
// @access  Private/Admin
exports.getListsByAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.findById(req.params.agentId);

  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.agentId}`, 404)
    );
  }

  // Make sure user is the agent creator
  if (agent.createdBy.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this agent's lists`,
        401
      )
    );
  }

  const listItems = await ListItem.find({
    assignedTo: req.params.agentId,
    createdBy: req.user.id
  });

  res.status(200).json({
    success: true,
    count: listItems.length,
    data: listItems
  });
});

// @desc    Get list items by batch
// @route   GET /api/lists/batch/:batchId
// @access  Private/Admin
exports.getListsByBatch = asyncHandler(async (req, res, next) => {
  const listItems = await ListItem.find({
    batchId: req.params.batchId,
    createdBy: req.user.id
  }).populate({
    path: 'assignedTo',
    select: 'name email phone'
  });

  res.status(200).json({
    success: true,
    count: listItems.length,
    data: listItems
  });
});

// @desc    Get all batches
// @route   GET /api/lists/batches
// @access  Private/Admin
exports.getBatches = asyncHandler(async (req, res, next) => {
  const batches = await ListItem.aggregate([
    { $match: { createdBy: req.user._id } },
    { $group: { _id: '$batchId', count: { $sum: 1 }, createdAt: { $first: '$createdAt' } } },
    { $sort: { createdAt: -1 } }
  ]);

  res.status(200).json({
    success: true,
    count: batches.length,
    data: batches
  });
});

// Helper function to parse CSV and Excel files
const parseFile = async (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (extension === '.csv') {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
          // Normalize field names (case insensitive)
          const normalizedData = {};
          Object.keys(data).forEach(key => {
            const normalizedKey = key.toLowerCase().trim();
            if (normalizedKey === 'firstname') normalizedData.firstName = data[key];
            else if (normalizedKey === 'phone') normalizedData.phone = data[key];
            else if (normalizedKey === 'notes') normalizedData.notes = data[key];
          });
          results.push(normalizedData);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', reject);
    });
  } else if (extension === '.xlsx' || extension === '.xls') {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    // Normalize field names
    return jsonData.map(row => {
      const normalizedData = {};
      Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase().trim();
        if (normalizedKey === 'firstname') normalizedData.firstName = row[key];
        else if (normalizedKey === 'phone') normalizedData.phone = row[key];
        else if (normalizedKey === 'notes') normalizedData.notes = row[key];
      });
      return normalizedData;
    });
  }
  
  throw new Error('Unsupported file format');
};

// Helper function to validate items
const validateItems = (items) => {
  if (items.length === 0) {
    return 'File is empty or does not contain valid data';
  }

  // Check required fields
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.firstName) {
      return `Row ${i + 1}: Missing FirstName`;
    }
    if (!item.phone) {
      return `Row ${i + 1}: Missing Phone`;
    }
  }

  return null;
};

// Helper function to distribute items among agents
const distributeItems = (items, agents, userId) => {
  const batchId = uuidv4(); // Generate unique batch ID
  const result = [];
  const agentCount = agents.length;
  
  // Calculate items per agent (floor division)
  const itemsPerAgent = Math.floor(items.length / agentCount);
  // Calculate remainder
  const remainder = items.length % agentCount;

  let currentIndex = 0;

  // Distribute items evenly
  for (let i = 0; i < agentCount; i++) {
    // Calculate how many items this agent should get
    // Add one extra if we're still distributing remainder items
    const itemsForThisAgent = itemsPerAgent + (i < remainder ? 1 : 0);
    
    for (let j = 0; j < itemsForThisAgent; j++) {
      if (currentIndex < items.length) {
        result.push({
          firstName: items[currentIndex].firstName,
          phone: items[currentIndex].phone,
          notes: items[currentIndex].notes || '',
          assignedTo: agents[i]._id,
          batchId,
          createdBy: userId
        });
        currentIndex++;
      }
    }
  }

  return result;
};

module.exports = exports;