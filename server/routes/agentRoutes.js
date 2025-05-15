const express = require('express');
const {
    getAgents,
    getAgent,
    createAgent,
    updateAgent,
    deleteAgent
} = require('../controllers/agentController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getAgents).post(createAgent);

router.route('/:id').get(getAgent).put(updateAgent).delete(deleteAgent);

module.exports = router;