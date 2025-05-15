const express = require('express');
const {
    uploadList,
    getLists,
    getListsByAgent,
    
    getBatches,
    getListsByBatch
} = require('../controllers/listController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getLists);

router.route('/upload').post(uploadList);

router.route('/agent/:agentId').get(getListsByAgent);

router.route('/batch/:batchId').get(getListsByBatch);

router.route('/batches').get(getBatches);

module.exports = router;