const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0.01, 'Target amount must be greater than 0'],
    max: [999999.99, 'Target amount cannot exceed 999,999.99']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
    max: [999999.99, 'Current amount cannot exceed 999,999.99']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Emergency Fund',
      'Vacation',
      'Home Purchase',
      'Car Purchase',
      'Education',
      'Wedding',
      'Retirement',
      'Investment',
      'Debt Payoff',
      'Business',
      'Other'
    ],
    index: true
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  color: {
    type: String,
    default: '#10b981',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  icon: {
    type: String,
    default: '🎯'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  milestones: [{
    amount: {
      type: Number,
      required: true,
      min: [0, 'Milestone amount cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Milestone description cannot exceed 200 characters']
    },
    achieved: {
      type: Boolean,
      default: false
    },
    achievedAt: Date
  }],
  contributions: [{
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Contribution amount must be greater than 0']
    },
    date: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Contribution description cannot exceed 200 characters']
    }
  }],
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    milestoneAlerts: {
      type: Boolean,
      default: true
    },
    deadlineReminders: {
      type: Boolean,
      default: true
    },
    progressUpdates: {
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
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, category: 1 });
goalSchema.index({ user: 1, targetDate: 1 });
goalSchema.index({ user: 1, priority: 1 });

// Virtual for formatted target amount
goalSchema.virtual('formattedTargetAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.targetAmount);
});

// Virtual for formatted current amount
goalSchema.virtual('formattedCurrentAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.currentAmount);
});

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  if (this.targetAmount === 0) return 0;
  return Math.min(100, (this.currentAmount / this.targetAmount) * 100);
});

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function() {
  return Math.max(0, this.targetAmount - this.currentAmount);
});

// Virtual for formatted remaining amount
goalSchema.virtual('formattedRemainingAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.remainingAmount);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for days elapsed
goalSchema.virtual('daysElapsed').get(function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const diffTime = now - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for total days
goalSchema.virtual('totalDays').get(function() {
  const start = new Date(this.startDate);
  const target = new Date(this.targetDate);
  const diffTime = target - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for average daily contribution needed
goalSchema.virtual('dailyContributionNeeded').get(function() {
  const remaining = this.remainingAmount;
  const daysLeft = this.daysRemaining;
  return daysLeft > 0 ? remaining / daysLeft : 0;
});

// Virtual for formatted daily contribution needed
goalSchema.virtual('formattedDailyContributionNeeded').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.dailyContributionNeeded);
});

// Virtual for status based on progress and time
goalSchema.virtual('progressStatus').get(function() {
  const progress = this.progressPercentage;
  const daysLeft = this.daysRemaining;
  const totalDays = this.totalDays;
  
  if (progress >= 100) return 'completed';
  if (daysLeft <= 0) return 'overdue';
  if (progress >= 75) return 'on-track';
  if (progress >= 50) return 'good-progress';
  if (progress >= 25) return 'moderate-progress';
  return 'needs-attention';
});

// Static method to get user's total goals
goalSchema.statics.getTotalGoals = async function(userId, status = 'active') {
  const matchQuery = { user: userId };
  if (status) matchQuery.status = status;

  const result = await this.aggregate([
    { $match: matchQuery },
    { $group: { _id: null, total: { $sum: '$targetAmount' } } }
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Static method to get goals by category
goalSchema.statics.getGoalsByCategory = async function(userId) {
  return await this.aggregate([
    { $match: { user: userId, status: 'active' } },
    { $group: { _id: '$category', total: { $sum: '$targetAmount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
};

// Instance method to add contribution
goalSchema.methods.addContribution = function(amount, description = '') {
  this.currentAmount += amount;
  this.contributions.push({
    amount,
    description,
    date: new Date()
  });
  
  // Check milestones
  this.milestones.forEach(milestone => {
    if (!milestone.achieved && this.currentAmount >= milestone.amount) {
      milestone.achieved = true;
      milestone.achievedAt = new Date();
    }
  });
  
  // Update status if completed
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
  }
  
  return this.save();
};

// Instance method to get goal summary
goalSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    targetAmount: this.targetAmount,
    formattedTargetAmount: this.formattedTargetAmount,
    currentAmount: this.currentAmount,
    formattedCurrentAmount: this.formattedCurrentAmount,
    category: this.category,
    targetDate: this.targetDate,
    startDate: this.startDate,
    priority: this.priority,
    status: this.status,
    color: this.color,
    icon: this.icon,
    progressPercentage: this.progressPercentage,
    remainingAmount: this.remainingAmount,
    formattedRemainingAmount: this.formattedRemainingAmount,
    daysRemaining: this.daysRemaining,
    daysElapsed: this.daysElapsed,
    totalDays: this.totalDays,
    dailyContributionNeeded: this.dailyContributionNeeded,
    formattedDailyContributionNeeded: this.formattedDailyContributionNeeded,
    progressStatus: this.progressStatus,
    milestones: this.milestones,
    contributions: this.contributions,
    notifications: this.notifications,
    tags: this.tags,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Goal', goalSchema);
