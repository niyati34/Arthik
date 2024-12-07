const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Expense = require('../models/Expense');

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses for user
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('sortBy').optional().isIn(['date', 'amount', 'category']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    // Check for validation errors
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
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { user: req.user.userId, status: 'active' };
    
    if (category) {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const expenses = await Expense.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName');

    // Get total count for pagination
    const total = await Expense.countDocuments(query);

    // Get summary statistics
    const totalAmount = await Expense.getTotalExpenses(req.user.userId, startDate, endDate);
    const categoryBreakdown = await Expense.getExpensesByCategory(req.user.userId, startDate, endDate);

    res.json({
      success: true,
      data: {
        expenses: expenses.map(expense => expense.getSummary()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        },
        summary: {
          totalAmount,
          categoryBreakdown
        }
      }
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expenses'
    });
  }
});

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Amount must be between 0.01 and 999,999.99'),
  body('category')
    .isIn([
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Healthcare',
      'Education',
      'Housing',
      'Utilities',
      'Insurance',
      'Travel',
      'Gifts',
      'Personal Care',
      'Subscriptions',
      'Investments',
      'Other'
    ])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('paymentMethod')
    .optional()
    .isIn(['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'])
    .withMessage('Invalid payment method'),
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each tag cannot exceed 50 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const expenseData = {
      ...req.body,
      user: req.user.userId,
      date: req.body.date ? new Date(req.body.date) : new Date()
    };

    const expense = new Expense(expenseData);
    await expense.save();

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: {
        expense: expense.getSummary()
      }
    });

  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating expense'
    });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get a specific expense
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: 'active'
    }).populate('user', 'firstName lastName');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: {
        expense: expense.getSummary()
      }
    });

  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expense'
    });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Amount must be between 0.01 and 999,999.99'),
  body('category')
    .optional()
    .isIn([
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Healthcare',
      'Education',
      'Housing',
      'Utilities',
      'Insurance',
      'Travel',
      'Gifts',
      'Personal Care',
      'Subscriptions',
      'Investments',
      'Other'
    ])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('paymentMethod')
    .optional()
    .isIn(['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'])
    .withMessage('Invalid payment method'),
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each tag cannot exceed 50 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: 'active'
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title', 'amount', 'category', 'description', 'date',
      'paymentMethod', 'location', 'tags', 'receipt', 'notes'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        expense[field] = req.body[field];
      }
    });

    await expense.save();

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: {
        expense: expense.getSummary()
      }
    });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating expense'
    });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: 'active'
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Soft delete
    expense.status = 'deleted';
    await expense.save();

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting expense'
    });
  }
});

// @route   GET /api/expenses/analytics/summary
// @desc    Get expense analytics summary
// @access  Private
router.get('/analytics/summary', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date')
], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const totalExpenses = await Expense.getTotalExpenses(req.user.userId, startDate, endDate);
    const categoryBreakdown = await Expense.getExpensesByCategory(req.user.userId, startDate, endDate);
    const monthlyExpenses = await Expense.getMonthlyExpenses(req.user.userId, new Date().getFullYear());

    res.json({
      success: true,
      data: {
        totalExpenses,
        categoryBreakdown,
        monthlyExpenses
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

module.exports = router;
