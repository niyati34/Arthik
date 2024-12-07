const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Budget = require('../models/Budget');

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get all budgets for user
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('isActive').optional().isBoolean()
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
      isActive
    } = req.query;

    const query = { user: req.user.userId };
    
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (page - 1) * limit;
    const budgets = await Budget.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName');

    const total = await Budget.countDocuments(query);
    const totalBudget = await Budget.getTotalBudget(req.user.userId);
    const categoryBreakdown = await Budget.getBudgetsByCategory(req.user.userId);

    res.json({
      success: true,
      data: {
        budgets: budgets.map(budget => budget.getSummary()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        },
        summary: {
          totalBudget,
          categoryBreakdown
        }
      }
    });

  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching budgets'
    });
  }
});

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('amount').isFloat({ min: 0.01, max: 999999.99 }),
  body('category').isIn(['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Housing', 'Utilities', 'Insurance', 'Travel', 'Gifts', 'Personal Care', 'Subscriptions', 'Investments', 'Other']),
  body('period').isIn(['weekly', 'monthly', 'quarterly', 'yearly']),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('description').optional().isLength({ max: 500 }),
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

    const budgetData = {
      ...req.body,
      user: req.user.userId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };

    const budget = new Budget(budgetData);
    await budget.save();

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: {
        budget: budget.getSummary()
      }
    });

  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating budget'
    });
  }
});

// @route   GET /api/budgets/:id
// @desc    Get a specific budget
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('user', 'firstName lastName');

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.json({
      success: true,
      data: {
        budget: budget.getSummary()
      }
    });

  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching budget'
    });
  }
});

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put('/:id', [
  body('name').optional().isLength({ max: 100 }),
  body('amount').optional().isFloat({ min: 0.01, max: 999999.99 }),
  body('category').optional().isIn(['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Housing', 'Utilities', 'Insurance', 'Travel', 'Gifts', 'Personal Care', 'Subscriptions', 'Investments', 'Other']),
  body('period').optional().isIn(['weekly', 'monthly', 'quarterly', 'yearly']),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('description').optional().isLength({ max: 500 }),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('icon').optional().isString(),
  body('isActive').optional().isBoolean()
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

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    const allowedUpdates = ['name', 'amount', 'category', 'period', 'startDate', 'endDate', 'description', 'color', 'icon', 'isActive', 'notifications', 'tags', 'notes'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'startDate' || field === 'endDate') {
          budget[field] = new Date(req.body[field]);
        } else {
          budget[field] = req.body[field];
        }
      }
    });

    await budget.save();

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: {
        budget: budget.getSummary()
      }
    });

  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating budget'
    });
  }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    budget.isActive = false;
    await budget.save();

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });

  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting budget'
    });
  }
});

module.exports = router;
