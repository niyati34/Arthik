const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const { auth, checkOwnership } = require('../middleware/auth');
const { asyncHandler, sendSuccessResponse, sendErrorResponse } = require('../middleware/errorHandler');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('targetAmount')
    .isFloat({ min: 0.01 })
    .withMessage('Target amount must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category is required and must be less than 50 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  body('targetDate')
    .isISO8601()
    .withMessage('Target date must be a valid ISO date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('type')
    .optional()
    .isIn(['savings', 'debt_payoff', 'investment', 'purchase', 'emergency_fund', 'other'])
    .withMessage('Invalid goal type'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Icon must be less than 10 characters'),
  body('milestones')
    .optional()
    .isArray()
    .withMessage('Milestones must be an array'),
  body('milestones.*.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Milestone amount must be a positive number'),
  body('milestones.*.description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Milestone description must be less than 200 characters'),
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

  const goalData = {
    ...req.body,
    user: req.user._id
  };

  const goal = new Goal(goalData);
  await goal.save();

  sendSuccessResponse(res, {
    goal: goal.getSummary()
  }, 'Goal created successfully', 201);
}));

// @route   GET /api/goals
// @desc    Get all goals with filtering and pagination
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
  query('type')
    .optional()
    .isIn(['savings', 'debt_payoff', 'investment', 'purchase', 'emergency_fund', 'other'])
    .withMessage('Invalid goal type'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  query('status')
    .optional()
    .isIn(['active', 'completed', 'paused', 'cancelled'])
    .withMessage('Invalid status'),
  query('sortBy')
    .optional()
    .isIn(['title', 'targetAmount', 'targetDate', 'priority', 'status', 'progress'])
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
    type,
    priority,
    status,
    sortBy = 'targetDate',
    sortOrder = 'asc'
  } = req.query;

  // Build filter object
  const filter = { user: req.user._id };

  if (category) filter.category = category;
  if (type) filter.type = type;
  if (priority) filter.priority = priority;
  if (status) filter.status = status;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const goals = await Goal.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Goal.countDocuments(filter);

  sendSuccessResponse(res, {
    goals: goals.map(goal => goal.getSummary()),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// @route   GET /api/goals/active
// @desc    Get active goals
// @access  Private
router.get('/active', asyncHandler(async (req, res) => {
  const goals = await Goal.getActive(req.user._id);

  sendSuccessResponse(res, {
    goals: goals.map(goal => goal.getSummary())
  });
}));

// @route   GET /api/goals/:id
// @desc    Get a specific goal
// @access  Private
router.get('/:id', checkOwnership(Goal), asyncHandler(async (req, res) => {
  sendSuccessResponse(res, {
    goal: req.resource.getSummary()
  });
}));

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', checkOwnership(Goal), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('targetAmount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Target amount must be a positive number'),
  body('currentAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current amount must be a positive number'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  body('targetDate')
    .optional()
    .isISO8601()
    .withMessage('Target date must be a valid ISO date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('type')
    .optional()
    .isIn(['savings', 'debt_payoff', 'investment', 'purchase', 'emergency_fund', 'other'])
    .withMessage('Invalid goal type'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
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

  const goal = req.resource;

  // Update fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      if (key === 'alerts' && typeof req.body[key] === 'object') {
        goal.alerts = { ...goal.alerts, ...req.body[key] };
      } else {
        goal[key] = req.body[key];
      }
    }
  });

  await goal.save();

  sendSuccessResponse(res, {
    goal: goal.getSummary()
  }, 'Goal updated successfully');
}));

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', checkOwnership(Goal), asyncHandler(async (req, res) => {
  await req.resource.remove();

  sendSuccessResponse(res, {}, 'Goal deleted successfully');
}));

// @route   POST /api/goals/:id/contribute
// @desc    Add contribution to a goal
// @access  Private
router.post('/:id/contribute', checkOwnership(Goal), [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Contribution amount must be a positive number')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, errors.array()[0].msg, 400);
  }

  const { amount } = req.body;
  const goal = req.resource;

  await goal.addContribution(amount);

  sendSuccessResponse(res, {
    goal: goal.getSummary()
  }, 'Contribution added successfully');
}));

// @route   GET /api/goals/stats/overview
// @desc    Get goal statistics overview
// @access  Private
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await Goal.getStats(req.user._id);

  sendSuccessResponse(res, { stats });
}));

// @route   GET /api/goals/stats/categories
// @desc    Get goal breakdown by category
// @access  Private
router.get('/stats/categories', asyncHandler(async (req, res) => {
  const categories = await Goal.getCategoryBreakdown(req.user._id);

  sendSuccessResponse(res, { categories });
}));

// @route   GET /api/goals/categories
// @desc    Get all unique categories for the user
// @access  Private
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Goal.distinct('category', { user: req.user._id });

  sendSuccessResponse(res, { categories });
}));

// @route   GET /api/goals/types
// @desc    Get all unique types for the user
// @access  Private
router.get('/types', asyncHandler(async (req, res) => {
  const types = await Goal.distinct('type', { user: req.user._id });

  sendSuccessResponse(res, { types });
}));

// @route   POST /api/goals/:id/update-status
// @desc    Update goal status (for system use)
// @access  Private
router.post('/:id/update-status', checkOwnership(Goal), asyncHandler(async (req, res) => {
  await Goal.updateStatus();

  sendSuccessResponse(res, {}, 'Goal status updated successfully');
}));

// @route   GET /api/goals/search
// @desc    Search goals by title or description
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

  const goals = await Goal.find(filter)
    .sort({ targetDate: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Goal.countDocuments(filter);

  sendSuccessResponse(res, {
    goals: goals.map(goal => goal.getSummary()),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

module.exports = router;
