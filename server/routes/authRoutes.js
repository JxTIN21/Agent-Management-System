const express = require('express');
const { login, getMe, logout, register } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;