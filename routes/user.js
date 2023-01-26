const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.handleRegister);
router.post('/login', userController.handleLogin);
router.get('/refresh', userController.handleRefreshToken);
router.get('/logout', userController.handleLogout);

module.exports = router;
