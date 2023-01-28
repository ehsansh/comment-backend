const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { body } = require('express-validator');

router.post(
    '/register',
    body('email', 'Email is not valid.').escape().isEmail(),
    body('name', 'Please enter your name.').not().isEmpty().escape(),
    body('password', 'Password must be at least 8 characters')
        .isLength({
            min: 8,
        })
        .escape(),
    userController.handleRegister
);
router.post(
    '/login',
    body('email', 'Email is not valid.').not().escape().isEmpty(),
    body('password', 'Password must be at least 8 characters')
        .not()
        .isEmpty()
        .escape(),
    userController.handleLogin
);
router.get('/refresh', userController.handleRefreshToken);
router.get('/logout', userController.handleLogout);

module.exports = router;
