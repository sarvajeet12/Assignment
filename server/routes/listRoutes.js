const express = require('express');
const auth = require('../middleware/authMiddleware');
const { upload, distributeList, getAgentLists } = require('../controllers/listController');
const router = express.Router();

// @route   POST /api/lists/upload
// @desc    Upload CSV/XLSX and distribute list to agents
// @access  Private (Admin only)
router.post('/upload', auth, upload.single('listFile'), distributeList);

// @route   GET /api/lists/agent/:agentId
// @desc    Get all lists for a specific agent
// @access  Private (Admin only)
router.get('/agent/:agentId', auth, getAgentLists);

module.exports = router;