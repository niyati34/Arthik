const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Income = require('../models/Income');

const router = express.Router();

// @route   GET /api/incomes
// @desc    Get all incomes for user
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

    const query = { user: req.user.userId, status: 'active' };
    
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    const incomes = await Income.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'firstName lastName');

    const total = await Income.countDocuments(query);
    const totalAmount = await Income.getTotalIncome(req.user.userId, startDate, endDate);
    const categoryBreakdown = await Income.getIncomeByCategory(req.user.userId, startDate, endDate);

    res.json({
      success: true,
      data: {
        incomes: incomes.map(income => income.getSummary()),
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
    console.error('Get incomes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incomes'
    });
  }
});

// @route   POST /api/incomes
// @desc    Create a new income
// @access  Private
router.post('/', [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('amount').isFloat({ min: 0.01, max: 999999.99 }),
  body('category').isIn(['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Bonus', 'Commission', 'Interest', 'Dividends', 'Refund', 'Other']),
  body('date').optional().isISO8601(),
  body('description').optional().isLength({ max: 500 }),
  body('source').optional().isLength({ max: 200 }),
  body('paymentMethod').optional().isIn(['Direct Deposit', 'Check', 'Cash', 'Bank Transfer', 'Digital Wallet', 'Other'])
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

    const incomeData = {
      ...req.body,
      user: req.user.userId,
      date: req.body.date ? new Date(req.body.date) : new Date()
    };

    const income = new Income(incomeData);
    await income.save();

    res.status(201).json({
      success: true,
      message: 'Income created successfully',
      data: {
        income: income.getSummary()
      }
    });

  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating income'
    });
  }
});

// @route   GET /api/incomes/:id
// @desc    Get a specific income
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: 'active'
    }).populate('user', 'firstName lastName');

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    res.json({
      success: true,
      data: {
        income: income.getSummary()
      }
    });

  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching income'
    });
  }
});

// @route   PUT /api/incomes/:id
// @desc    Update an income
// @access  Private
router.put('/:id', [
  body('title').optional().isLength({ max: 100 }),
  body('amount').optional().isFloat({ min: 0.01, max: 999999.99 }),
  body('category').optional().isIn(['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Bonus', 'Commission', 'Interest', 'Dividends', 'Refund', 'Other']),
  body('date').optional().isISO8601(),
  body('description').optional().isLength({ max: 500 }),
  body('source').optional().isLength({ max: 200 }),
  body('paymentMethod').optional().isIn(['Direct Deposit', 'Check', 'Cash', 'Bank Transfer', 'Digital Wallet', 'Other'])
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

    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: 'active'
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    const allowedUpdates = ['title', 'amount', 'category', 'description', 'date', 'source', 'paymentMethod', 'notes'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        income[field] = req.body[field];
      }
    });

    await income.save();

    res.json({
      success: true,
      message: 'Income updated successfully',
      data: {
        income: income.getSummary()
      }
    });

  } catch (error) {
    console.error('Update income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating income'
    });
  }
});

// @route   DELETE /api/incomes/:id
// @desc    Delete an income (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: 'active'
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found'
      });
    }

    income.status = 'deleted';
    await income.save();

    res.json({
      success: true,
      message: 'Income deleted successfully'
    });

  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting income'
    });
  }
});

module.exports = router;
