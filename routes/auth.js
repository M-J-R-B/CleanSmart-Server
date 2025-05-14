const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Delete account route
router.delete('/delete-account', authMiddleware.authenticate, authController.deleteAccount);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-password', authController.getResetPasswordPage);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authController.changePassword);

module.exports = router; 