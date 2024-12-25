const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Budget = require('../models/Budget');
const { auth, checkOwnership } = require('../middleware/auth');
const { asyncHandler, sendSuccessResponse, sendErrorResponse } = require('../middleware/errorHandler');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required and must be less than 50 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('type')
    .optional()
    .isIn(['monthly', 'quarterly', 'yearly', 'custom'])
    .withMessage('Invalid budget type'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Icon must be less than 10 characters'),
  body('alerts.enabled')
    .optional()
    .isBoolean()
    .withMessage('Alerts enabled must be a boolean'),
  body('alerts.threshold')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Alert threshold must be between 1 and 100'),
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

  const budgetData = {
    ...req.body,
    user: req.user._id
  };

  const budget = new Budget(budgetData);
  await budget.save();

  sendSuccessResponse(res, {
    budget: budget.getSummary()
  }, 'Budget created successfully', 201);
}));

// @route   GET /api/budgets
// @desc    Get all budgets with filtering and pagination
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
  query('status')
    .optional()
    .isIn(['active', 'completed', 'cancelled', 'overdue'])
    .withMessage('Invalid status'),
  query('type')
    .optional()
    .isIn(['monthly', 'quarterly', 'yearly', 'custom'])
    .withMessage('Invalid budget type'),
  query('sortBy')
    .optional()
    .isIn(['name', 'amount', 'startDate', 'endDate', 'status'])
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
    status,
    type,
    sortBy = 'startDate',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { user: req.user._id };

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (type) filter.type = type;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const budgets = await Budget.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Budget.countDocuments(filter);

  sendSuccessResponse(res, {
    budgets: budgets.map(budget => budget.getSummary()),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// @route   GET /api/budgets/active
// @desc    Get active budgets
// @access  Private
router.get('/active', asyncHandler(async (req, res) => {
  const budgets = await Budget.getActive(req.user._id);

  sendSuccessResponse(res, {
    budgets: budgets.map(budget => budget.getSummary())
  });
}));

// @route   GET /api/budgets/:id
// @desc    Get a specific budget
// @access  Private
router.get('/:id', checkOwnership(Budget), asyncHandler(async (req, res) => {
  sendSuccessResponse(res, {
    budget: req.resource.getSummary()
  });
}));

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put('/:id', checkOwnership(Budget), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('type')
    .optional()
    .isIn(['monthly', 'quarterly', 'yearly', 'custom'])
    .withMessage('Invalid budget type'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Icon must be less than 10 characters'),
  body('alerts.enabled')
    .optional()
    .isBoolean()
    .withMessage('Alerts enabled must be a boolean'),
  body('alerts.threshold')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Alert threshold must be between 1 and 100'),
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

  const budget = req.resource;

  // Update fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      if (key === 'alerts' && typeof req.body[key] === 'object') {
        budget.alerts = { ...budget.alerts, ...req.body[key] };
      } else {
        budget[key] = req.body[key];
      }
    }
  });

  await budget.save();

  sendSuccessResponse(res, {
    budget: budget.getSummary()
  }, 'Budget updated successfully');
}));

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete('/:id', checkOwnership(Budget), asyncHandler(async (req, res) => {
  await req.resource.remove();

  sendSuccessResponse(res, {}, 'Budget deleted successfully');
}));

// @route   GET /api/budgets/stats/overview
// @desc    Get budget statistics overview
// @access  Private
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await Budget.getStats(req.user._id);

  sendSuccessResponse(res, { stats });
}));

// @route   GET /api/budgets/stats/categories
// @desc    Get budget breakdown by category
// @access  Private
router.get('/stats/categories', asyncHandler(async (req, res) => {
  const categories = await Budget.getCategoryBreakdown(req.user._id);

  sendSuccessResponse(res, { categories });
}));

// @route   GET /api/budgets/categories
// @desc    Get all unique categories for the user
// @access  Private
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Budget.distinct('category', { user: req.user._id });

  sendSuccessResponse(res, { categories });
}));

// @route   POST /api/budgets/:id/update-status
// @desc    Update budget status (for system use)
// @access  Private
router.post('/:id/update-status', checkOwnership(Budget), asyncHandler(async (req, res) => {
  await Budget.updateStatus();

  sendSuccessResponse(res, {}, 'Budget status updated successfully');
}));

// @route   GET /api/budgets/search
// @desc    Search budgets by name or description
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
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } }
    ]
  };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const budgets = await Budget.find(filter)
    .sort({ startDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Budget.countDocuments(filter);

  sendSuccessResponse(res, {
    budgets: budgets.map(budget => budget.getSummary()),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

module.exports = router;
