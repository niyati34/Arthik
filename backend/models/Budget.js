const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
    ],
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    max: [999999.99, 'Amount cannot exceed 999,999.99']
  },
  period: {
    type: String,
    required: [true, 'Budget period is required'],
    enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  color: {
    type: String,
    default: '#3b82f6',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  icon: {
    type: String,
    default: '💰'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 80, // Percentage
      min: [0, 'Threshold must be at least 0%'],
      max: [100, 'Threshold cannot exceed 100%']
    },
    emailAlerts: {
      type: Boolean,
      default: true
    },
    pushAlerts: {
      type: Boolean,
      default: true
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
budgetSchema.index({ user: 1, category: 1 });
budgetSchema.index({ user: 1, isActive: 1 });
budgetSchema.index({ user: 1, startDate: 1, endDate: 1 });

// Virtual for formatted amount
budgetSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.amount);
});

// Virtual for budget progress (calculated from expenses)
budgetSchema.virtual('progress').get(function() {
  // This will be calculated when expenses are populated
  return 0;
});

// Virtual for remaining amount
budgetSchema.virtual('remaining').get(function() {
  return Math.max(0, this.amount - (this.spent || 0));
});

// Virtual for formatted remaining amount
budgetSchema.virtual('formattedRemaining').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.remaining);
});

// Virtual for spent amount
budgetSchema.virtual('spent').get(function() {
  // This will be calculated when expenses are populated
  return 0;
});

// Virtual for formatted spent amount
budgetSchema.virtual('formattedSpent').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.spent || 0);
});

// Virtual for percentage used
budgetSchema.virtual('percentageUsed').get(function() {
  if (this.amount === 0) return 0;
  return Math.min(100, ((this.spent || 0) / this.amount) * 100);
});

// Virtual for status
budgetSchema.virtual('status').get(function() {
  const percentage = this.percentageUsed;
  if (percentage >= 100) return 'exceeded';
  if (percentage >= this.notifications.threshold) return 'warning';
  return 'good';
});

// Static method to get user's total budget
budgetSchema.statics.getTotalBudget = async function(userId, startDate = null, endDate = null) {
  const matchQuery = { user: userId, isActive: true };
  
  if (startDate || endDate) {
    matchQuery.$or = [
      { startDate: { $lte: endDate || new Date() } },
      { endDate: { $gte: startDate || new Date(0) } }
    ];
  }

  const result = await this.aggregate([
    { $match: matchQuery },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Static method to get budgets by category
budgetSchema.statics.getBudgetsByCategory = async function(userId) {
  return await this.aggregate([
    { $match: { user: userId, isActive: true } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
};

// Instance method to get budget summary
budgetSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    name: this.name,
    category: this.category,
    amount: this.amount,
    formattedAmount: this.formattedAmount,
    period: this.period,
    startDate: this.startDate,
    endDate: this.endDate,
    description: this.description,
    color: this.color,
    icon: this.icon,
    isActive: this.isActive,
    progress: this.progress,
    spent: this.spent,
    formattedSpent: this.formattedSpent,
    remaining: this.remaining,
    formattedRemaining: this.formattedRemaining,
    percentageUsed: this.percentageUsed,
    status: this.status,
    notifications: this.notifications,
    tags: this.tags,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Budget', budgetSchema);
