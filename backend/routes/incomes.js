const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Income = require('../models/Income');
const { auth, checkOwnership } = require('../middleware/auth');
const { asyncHandler, sendSuccessResponse, sendErrorResponse } = require('../middleware/errorHandler');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   POST /api/incomes
// @desc    Create a new income
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required and must be less than 50 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('source')
    .optional()
    .isIn(['salary', 'freelance', 'business', 'investment', 'gift', 'refund', 'other'])
    .withMessage('Invalid source'),
  body('paymentMethod')
    .optional()
    .isIn(['bank_transfer', 'cash', 'check', 'digital_wallet', 'other'])
    .withMessage('Invalid payment method'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag must be less than 30 characters')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, errors.array()[0].msg, 400);
  }

  const incomeData = {
    ...req.body,
    user: req.user._id,
    date: req.body.date || new Date()
  };

  const income = new Income(incomeData);
  await income.save();

  sendSuccessResponse(res, {
    income: income.getSummary()
  }, 'Income created successfully', 201);
}));

// @route   GET /api/incomes
// @desc    Get all incomes with filtering and pagination
// @access  Private
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters'),
  query('source')
    .optional()
    .isIn(['salary', 'freelance', 'business', 'investment', 'gift', 'refund', 'other'])
    .withMessage('Invalid source'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  query('minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min amount must be a positive number'),
  query('maxAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max amount must be a positive number'),
  query('sortBy')
    .optional()
    .isIn(['date', 'amount', 'title', 'category', 'source'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, errors.array()[0].msg, 400);
  }

  const {
    page = 1,
    limit = 20,
    category,
    source,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortBy = 'date',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { user: req.user._id };

  if (category) filter.category = category;
  if (source) filter.source = source;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) filter.amount.$gte = parseFloat(minAmount);
    if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const incomes = await Income.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Income.countDocuments(filter);

  sendSuccessResponse(res, {
    incomes: incomes.map(income => income.getSummary()),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// @route   GET /api/incomes/:id
// @desc    Get a specific income
// @access  Private
router.get('/:id', checkOwnership(Income), asyncHandler(async (req, res) => {
  sendSuccessResponse(res, {
    income: req.resource.getSummary()
  });
}));

// @route   PUT /api/incomes/:id
// @desc    Update an income
// @access  Private
router.put('/:id', checkOwnership(Income), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('source')
    .optional()
    .isIn(['salary', 'freelance', 'business', 'investment', 'gift', 'refund', 'other'])
    .withMessage('Invalid source'),
  body('paymentMethod')
    .optional()
    .isIn(['bank_transfer', 'cash', 'check', 'digital_wallet', 'other'])
    .withMessage('Invalid payment method'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag must be less than 30 characters')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, errors.array()[0].msg, 400);
  }

  const income = req.resource;

  // Update fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      income[key] = req.body[key];
    }
  });

  await income.save();

  sendSuccessResponse(res, {
    income: income.getSummary()
  }, 'Income updated successfully');
}));

// @route   DELETE /api/incomes/:id
// @desc    Delete an income
// @access  Private
router.delete('/:id', checkOwnership(Income), asyncHandler(async (req, res) => {
  await req.resource.remove();

  sendSuccessResponse(res, {}, 'Income deleted successfully');
}));

// @route   GET /api/incomes/stats/overview
// @desc    Get income statistics overview
// @access  Private
router.get('/stats/overview', [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
], asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const stats = await Income.getStats(req.user._id, startDate, endDate);

  sendSuccessResponse(res, { stats });
}));

// @route   GET /api/incomes/stats/sources
// @desc    Get income breakdown by source
// @access  Private
router.get('/stats/sources', [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
], asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const sources = await Income.getSourceBreakdown(req.user._id, startDate, endDate);

  sendSuccessResponse(res, { sources });
}));

// @route   GET /api/incomes/stats/trends
// @desc    Get monthly income trends
// @access  Private
router.get('/stats/trends', [
  query('months')
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage('Months must be between 1 and 60')
], asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;

  const trends = await Income.getMonthlyTrends(req.user._id, parseInt(months));

  sendSuccessResponse(res, { trends });
}));

// @route   GET /api/incomes/categories
// @desc    Get all unique categories for the user
// @access  Private
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Income.distinct('category', { user: req.user._id });

  sendSuccessResponse(res, { categories });
}));

// @route   GET /api/incomes/sources
// @desc    Get all unique sources for the user
// @access  Private
router.get('/sources', asyncHandler(async (req, res) => {
  const sources = await Income.distinct('source', { user: req.user._id });

  sendSuccessResponse(res, { sources });
}));

// @route   GET /api/incomes/search
// @desc    Search incomes by title or description
// @access  Private
router.get('/search', [
  query('q')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query is required'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  const filter = {
    user: req.user._id,
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } }
    ]
  };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const incomes = await Income.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Income.countDocuments(filter);

  sendSuccessResponse(res, {
    incomes: incomes.map(income => income.getSummary()),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

module.exports = router;
