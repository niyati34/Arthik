const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const { asyncHandler, sendSuccessResponse, sendErrorResponse, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, errors.array()[0].msg, 400);
  }

  const { username, email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return sendErrorResponse(res, 'Email already registered', 400);
    }
    if (existingUser.username === username) {
      return sendErrorResponse(res, 'Username already taken', 400);
    }
  }

  // Create new user
  const user = new User({
    username,
    email,
    password,
    firstName,
    lastName
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Send response
  sendSuccessResponse(res, {
    user: user.getProfile(),
    token
  }, 'User registered successfully', 201);
}));

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, errors.array()[0].msg, 400);
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return sendErrorResponse(res, 'Invalid credentials', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    return sendErrorResponse(res, 'Account is deactivated', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendErrorResponse(res, 'Invalid credentials', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Send response
  sendSuccessResponse(res, {
    user: user.getProfile(),
    token
  }, 'Login successful');
}));

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  sendSuccessResponse(res, {
    user: user.getProfile()
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR'])
    .withMessage('Invalid currency'),
  body('timezone')
    .optional()
    .isString()
    .withMessage('Invalid timezone')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, errors.array()[0].msg, 400);
  }

  const { firstName, lastName, currency, timezone, preferences } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (currency) user.currency = currency;
  if (timezone) user.timezone = timezone;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  await user.save();

  sendSuccessResponse(res, {
    user: user.getProfile()
  }, 'Profile updated successfully');
}));

// @route   PUT /api/users/password
// @desc    Change password
// @access  Private
router.put('/password', auth, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, errors.array()[0].msg, 400);
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return sendErrorResponse(res, 'Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendSuccessResponse(res, {}, 'Password changed successfully');
}));

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, asyncHandler(async (req, res) => {
  const stats = await User.getUserStats(req.user._id);
  
  sendSuccessResponse(res, { stats });
}));

// @route   POST /api/users/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // by removing the token from storage
  sendSuccessResponse(res, {}, 'Logged out successfully');
}));

module.exports = router;
