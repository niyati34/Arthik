const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    max: [999999999, 'Amount cannot exceed 999,999,999']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
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
  type: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'custom'],
    default: 'monthly'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'overdue'],
    default: 'active'
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
  alerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 80, // Alert when 80% of budget is used
      min: [1, 'Threshold must be at least 1%'],
      max: [100, 'Threshold cannot exceed 100%']
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true }
    }
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    },
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    shareType: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
budgetSchema.index({ user: 1, startDate: -1 });
budgetSchema.index({ user: 1, category: 1 });
budgetSchema.index({ user: 1, status: 1 });
budgetSchema.index({ startDate: 1, endDate: 1 });

// Virtual for formatted amount
budgetSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.amount);
});

// Virtual for budget progress
budgetSchema.virtual('progress').get(function() {
  if (!this.spent) return 0;
  return Math.min((this.spent / this.amount) * 100, 100);
});

// Virtual for remaining amount
budgetSchema.virtual('remaining').get(function() {
  if (!this.spent) return this.amount;
  return Math.max(this.amount - this.spent, 0);
});

// Virtual for formatted remaining amount
budgetSchema.virtual('formattedRemaining').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.remaining);
});

// Virtual for days remaining
budgetSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
});

// Virtual for daily spending limit
budgetSchema.virtual('dailyLimit').get(function() {
  if (this.daysRemaining <= 0) return 0;
  return this.remaining / this.daysRemaining;
});

// Virtual for formatted daily limit
budgetSchema.virtual('formattedDailyLimit').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.dailyLimit);
});

// Virtual for budget status
budgetSchema.virtual('statusInfo').get(function() {
  const progress = this.progress;
  
  if (progress >= 100) {
    return {
      status: 'exceeded',
      message: 'Budget exceeded',
      color: '#ef4444'
    };
  } else if (progress >= this.alerts.threshold) {
    return {
      status: 'warning',
      message: 'Approaching budget limit',
      color: '#f59e0b'
    };
  } else if (progress >= 50) {
    return {
      status: 'moderate',
      message: 'Moderate spending',
      color: '#3b82f6'
    };
  } else {
    return {
      status: 'good',
      message: 'On track',
      color: '#10b981'
    };
  }
});

// Pre-save middleware to validate dates
budgetSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

// Instance method to get budget summary
budgetSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    amount: this.amount,
    formattedAmount: this.formattedAmount,
    category: this.category,
    startDate: this.startDate,
    endDate: this.endDate,
    type: this.type,
    status: this.status,
    progress: this.progress,
    remaining: this.remaining,
    formattedRemaining: this.formattedRemaining,
    daysRemaining: this.daysRemaining,
    dailyLimit: this.dailyLimit,
    formattedDailyLimit: this.formattedDailyLimit,
    statusInfo: this.statusInfo,
    color: this.color,
    icon: this.icon,
    createdAt: this.createdAt
  };
};

// Static method to get active budgets
budgetSchema.statics.getActive = function(userId) {
  const now = new Date();
  return this.find({
    user: userId,
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ startDate: -1 });
};

// Static method to get budgets by category
budgetSchema.statics.getByCategory = function(userId, category) {
  return this.find({ user: userId, category: category }).sort({ startDate: -1 });
};

// Static method to get budgets by date range
budgetSchema.statics.getByDateRange = function(userId, startDate, endDate) {
  return this.find({
    user: userId,
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  }).sort({ startDate: -1 });
};

// Static method to get budget statistics
budgetSchema.statics.getStats = async function(userId) {
  const now = new Date();
  
  const stats = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        startDate: { $lte: now },
        endDate: { $gte: now }
      }
    },
    {
      $group: {
        _id: null,
        totalBudgets: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        averageAmount: { $avg: '$amount' },
        activeBudgets: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        completedBudgets: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        overdueBudgets: {
          $sum: {
            $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0]
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalBudgets: 0,
    totalAmount: 0,
    averageAmount: 0,
    activeBudgets: 0,
    completedBudgets: 0,
    overdueBudgets: 0
  };
};

// Static method to get category breakdown
budgetSchema.statics.getCategoryBreakdown = async function(userId) {
  const now = new Date();
  
  return await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        startDate: { $lte: now },
        endDate: { $gte: now }
      }
    },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        averageAmount: { $avg: '$amount' }
      }
    },
    {
      $project: {
        category: '$_id',
        totalAmount: 1,
        count: 1,
        averageAmount: { $round: ['$averageAmount', 2] }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

// Static method to update budget status
budgetSchema.statics.updateStatus = async function() {
  const now = new Date();
  
  // Update overdue budgets
  await this.updateMany(
    {
      endDate: { $lt: now },
      status: 'active'
    },
    {
      $set: { status: 'overdue' }
    }
  );
  
  // Update completed budgets
  await this.updateMany(
    {
      endDate: { $lt: now },
      status: 'overdue'
    },
    {
      $set: { status: 'completed' }
    }
  );
};

module.exports = mongoose.model('Budget', budgetSchema);
