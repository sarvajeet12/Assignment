const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

module.exports = router;