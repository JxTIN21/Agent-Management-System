const Agent = require('../models/Agent');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private/Admin
exports.getAgents = asyncHandler(async (req, res, next) => {
  const agents = await Agent.find({ createdBy: req.user.id });

  res.status(200).json({
    success: true,
    count: agents.length,
    data: agents
  });
});

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Private/Admin
exports.getAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the agent creator
  if (agent.createdBy.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this agent`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: agent
  });
});

// @desc    Create new agent
// @route   POST /api/agents
// @access  Private/Admin
exports.createAgent = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const agent = await Agent.create(req.body);

  res.status(201).json({
    success: true,
    data: agent
  });
});

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
exports.updateAgent = asyncHandler(async (req, res, next) => {
  let agent = await Agent.findById(req.params.id);

  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the agent creator
  if (agent.createdBy.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this agent`,
        401
      )
    );
  }

  agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: agent
  });
});

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
exports.deleteAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    return next(new ErrorResponse('Agent not found', 404));
  }

  await Agent.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {},
    message: 'Agent deleted successfully'
  });
});