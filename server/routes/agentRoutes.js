const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createAgent, getAgents } = require('../controllers/agentController');
const router = express.Router();

// @route   POST /api/agents
// @desc    Create a new agent
// @access  Private (Admin only)
router.post('/', auth, createAgent);

// @route   GET /api/agents
// @desc    Get all agents
// @access  Private (Admin only)
router.get('/', auth, getAgents);

module.exports = router;