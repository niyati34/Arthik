const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const { auth, checkOwnership } = require('../middleware/auth');
const { asyncHandler, sendSuccessResponse, sendErrorResponse, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   POST /api/expenses
// @desc    Create a new expense
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
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'check', 'other'])
    .withMessage('Invalid payment method'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
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

  const expenseData = {
    ...req.body,
    user: req.user._id,
    date: req.body.date || new Date()
  };

  const expense = new Expense(expenseData);
  await expense.save();

  sendSuccessResponse(res, {
    expense: expense.getSummary()
  }, 'Expense created successfully', 201);
}));

// @route   GET /api/expenses
// @desc    Get all expenses with filtering and pagination
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
    .isIn(['date', 'amount', 'title', 'category'])
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
  const expenses = await Expense.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Expense.countDocuments(filter);

  sendSuccessResponse(res, {
    expenses: expenses.map(expense => expense.getSummary()),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// @route   GET /api/expenses/:id
// @desc    Get a specific expense
// @access  Private
router.get('/:id', checkOwnership(Expense), asyncHandler(async (req, res) => {
  sendSuccessResponse(res, {
    expense: req.resource.getSummary()
  });
}));

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', checkOwnership(Expense), [
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
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'check', 'other'])
    .withMessage('Invalid payment method'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
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

  const expense = req.resource;

  // Update fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      expense[key] = req.body[key];
    }
  });

  await expense.save();

  sendSuccessResponse(res, {
    expense: expense.getSummary()
  }, 'Expense updated successfully');
}));

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', checkOwnership(Expense), asyncHandler(async (req, res) => {
  await req.resource.remove();

  sendSuccessResponse(res, {}, 'Expense deleted successfully');
}));

// @route   GET /api/expenses/stats/overview
// @desc    Get expense statistics overview
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

  const stats = await Expense.getStats(req.user._id, startDate, endDate);

  sendSuccessResponse(res, { stats });
}));

// @route   GET /api/expenses/stats/categories
// @desc    Get expense breakdown by category
// @access  Private
router.get('/stats/categories', [
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

  const categories = await Expense.getCategoryBreakdown(req.user._id, startDate, endDate);

  sendSuccessResponse(res, { categories });
}));

// @route   GET /api/expenses/stats/trends
// @desc    Get monthly expense trends
// @access  Private
router.get('/stats/trends', [
  query('months')
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage('Months must be between 1 and 60')
], asyncHandler(async (req, res) => {
  const { months = 12 } = req.query;

  const trends = await Expense.getMonthlyTrends(req.user._id, parseInt(months));

  sendSuccessResponse(res, { trends });
}));

// @route   GET /api/expenses/categories
// @desc    Get all unique categories for the user
// @access  Private
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Expense.distinct('category', { user: req.user._id });

  sendSuccessResponse(res, { categories });
}));

// @route   GET /api/expenses/search
// @desc    Search expenses by title or description
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

  const expenses = await Expense.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Expense.countDocuments(filter);

  sendSuccessResponse(res, {
    expenses: expenses.map(expense => expense.getSummary()),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

module.exports = router;
