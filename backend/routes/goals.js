const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Goal = require('../models/Goal');

const router = express.Router();

// @route   GET /api/goals
// @desc    Get all goals for user
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('status').optional().isIn(['active', 'completed', 'paused', 'cancelled']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      status,
      priority
    } = req.query;

    const query = { user: req.user.userId };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;
    const goals = await Goal.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName');

    const total = await Goal.countDocuments(query);
    const totalGoals = await Goal.getTotalGoals(req.user.userId);
    const categoryBreakdown = await Goal.getGoalsByCategory(req.user.userId);

    res.json({
      success: true,
      data: {
        goals: goals.map(goal => goal.getSummary()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        },
        summary: {
          totalGoals,
          categoryBreakdown
        }
      }
    });

  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching goals'
    });
  }
});

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('targetAmount').isFloat({ min: 0.01, max: 999999.99 }),
  body('category').isIn(['Emergency Fund', 'Vacation', 'Home Purchase', 'Car Purchase', 'Education', 'Wedding', 'Retirement', 'Investment', 'Debt Payoff', 'Business', 'Other']),
  body('targetDate').isISO8601(),
  body('description').optional().isLength({ max: 500 }),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('icon').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const goalData = {
      ...req.body,
      user: req.user.userId,
      targetDate: new Date(req.body.targetDate)
    };

    const goal = new Goal(goalData);
    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: {
        goal: goal.getSummary()
      }
    });

  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating goal'
    });
  }
});

// @route   GET /api/goals/:id
// @desc    Get a specific goal
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('user', 'firstName lastName');

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.json({
      success: true,
      data: {
        goal: goal.getSummary()
      }
    });

  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching goal'
    });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', [
  body('title').optional().isLength({ max: 100 }),
  body('targetAmount').optional().isFloat({ min: 0.01, max: 999999.99 }),
  body('category').optional().isIn(['Emergency Fund', 'Vacation', 'Home Purchase', 'Car Purchase', 'Education', 'Wedding', 'Retirement', 'Investment', 'Debt Payoff', 'Business', 'Other']),
  body('targetDate').optional().isISO8601(),
  body('description').optional().isLength({ max: 500 }),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('icon').optional().isString(),
  body('status').optional().isIn(['active', 'completed', 'paused', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const allowedUpdates = ['title', 'targetAmount', 'category', 'targetDate', 'description', 'priority', 'color', 'icon', 'status', 'notifications', 'tags', 'notes'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'targetDate') {
          goal[field] = new Date(req.body[field]);
        } else {
          goal[field] = req.body[field];
        }
      }
    });

    await goal.save();

    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: {
        goal: goal.getSummary()
      }
    });

  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating goal'
    });
  }
});

// @route   POST /api/goals/:id/contribute
// @desc    Add contribution to a goal
// @access  Private
router.post('/:id/contribute', [
  body('amount').isFloat({ min: 0.01, max: 999999.99 }),
  body('description').optional().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, description } = req.body;

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: 'active'
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found or not active'
      });
    }

    await goal.addContribution(amount, description);

    res.json({
      success: true,
      message: 'Contribution added successfully',
      data: {
        goal: goal.getSummary()
      }
    });

  } catch (error) {
    console.error('Add contribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding contribution'
    });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    goal.status = 'cancelled';
    await goal.save();

    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });

  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting goal'
    });
  }
});

module.exports = router;
