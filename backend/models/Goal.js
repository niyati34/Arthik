const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
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
    max: [999999999, 'Target amount cannot exceed 999,999,999']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
    max: [999999999, 'Current amount cannot exceed 999,999,999']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  type: {
    type: String,
    enum: ['savings', 'debt_payoff', 'investment', 'purchase', 'emergency_fund', 'other'],
    default: 'savings'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  color: {
    type: String,
    default: '#3b82f6',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  icon: {
    type: String,
    default: '🎯'
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
  alerts: {
    enabled: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 80, // Alert when 80% of goal is reached
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
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'monthly'
    },
    contributionAmount: {
      type: Number,
      min: [0, 'Contribution amount cannot be negative']
    },
    nextContributionDate: Date
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
goalSchema.index({ user: 1, targetDate: -1 });
goalSchema.index({ user: 1, category: 1 });
goalSchema.index({ user: 1, status: 1 });
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
goalSchema.virtual('progress').get(function() {
  if (this.targetAmount === 0) return 0;
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Virtual for remaining amount
goalSchema.virtual('remaining').get(function() {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

// Virtual for formatted remaining amount
goalSchema.virtual('formattedRemaining').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.remaining);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
});

// Virtual for daily contribution needed
goalSchema.virtual('dailyContributionNeeded').get(function() {
  if (this.daysRemaining <= 0) return 0;
  return this.remaining / this.daysRemaining;
});

// Virtual for formatted daily contribution needed
goalSchema.virtual('formattedDailyContributionNeeded').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.dailyContributionNeeded);
});

// Virtual for goal status info
goalSchema.virtual('statusInfo').get(function() {
  const progress = this.progress;
  const daysRemaining = this.daysRemaining;
  
  if (progress >= 100) {
    return {
      status: 'completed',
      message: 'Goal achieved!',
      color: '#10b981'
    };
  } else if (daysRemaining <= 0) {
    return {
      status: 'overdue',
      message: 'Target date passed',
      color: '#ef4444'
    };
  } else if (progress >= this.alerts.threshold) {
    return {
      status: 'near_completion',
      message: 'Almost there!',
      color: '#f59e0b'
    };
  } else if (progress >= 50) {
    return {
      status: 'on_track',
      message: 'On track',
      color: '#3b82f6'
    };
  } else {
    return {
      status: 'needs_attention',
      message: 'Needs attention',
      color: '#6b7280'
    };
  }
});

// Virtual for priority color
goalSchema.virtual('priorityColor').get(function() {
  const colors = {
    low: '#6b7280',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444'
  };
  return colors[this.priority] || colors.medium;
});

// Pre-save middleware to validate dates
goalSchema.pre('save', function(next) {
  if (this.targetDate <= this.startDate) {
    return next(new Error('Target date must be after start date'));
  }
  next();
});

// Instance method to get goal summary
goalSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    targetAmount: this.targetAmount,
    formattedTargetAmount: this.formattedTargetAmount,
    currentAmount: this.currentAmount,
    formattedCurrentAmount: this.formattedCurrentAmount,
    category: this.category,
    type: this.type,
    priority: this.priority,
    startDate: this.startDate,
    targetDate: this.targetDate,
    status: this.status,
    progress: this.progress,
    remaining: this.remaining,
    formattedRemaining: this.formattedRemaining,
    daysRemaining: this.daysRemaining,
    dailyContributionNeeded: this.dailyContributionNeeded,
    formattedDailyContributionNeeded: this.formattedDailyContributionNeeded,
    statusInfo: this.statusInfo,
    priorityColor: this.priorityColor,
    color: this.color,
    icon: this.icon,
    createdAt: this.createdAt
  };
};

// Instance method to add contribution
goalSchema.methods.addContribution = function(amount) {
  if (amount <= 0) {
    throw new Error('Contribution amount must be positive');
  }
  
  this.currentAmount += amount;
  
  // Check if goal is completed
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'completed';
    this.currentAmount = this.targetAmount; // Don't exceed target
  }
  
  // Check milestones
  this.milestones.forEach(milestone => {
    if (!milestone.achieved && this.currentAmount >= milestone.amount) {
      milestone.achieved = true;
      milestone.achievedAt = new Date();
    }
  });
  
  return this.save();
};

// Static method to get active goals
goalSchema.statics.getActive = function(userId) {
  return this.find({
    user: userId,
    status: 'active'
  }).sort({ priority: -1, targetDate: 1 });
};

// Static method to get goals by category
goalSchema.statics.getByCategory = function(userId, category) {
  return this.find({ user: userId, category: category }).sort({ targetDate: 1 });
};

// Static method to get goals by type
goalSchema.statics.getByType = function(userId, type) {
  return this.find({ user: userId, type: type }).sort({ targetDate: 1 });
};

// Static method to get goals by priority
goalSchema.statics.getByPriority = function(userId, priority) {
  return this.find({ user: userId, priority: priority }).sort({ targetDate: 1 });
};

// Static method to get goal statistics
goalSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: null,
        totalGoals: { $sum: 1 },
        totalTargetAmount: { $sum: '$targetAmount' },
        totalCurrentAmount: { $sum: '$currentAmount' },
        averageProgress: { $avg: { $multiply: [{ $divide: ['$currentAmount', '$targetAmount'] }, 100] } },
        activeGoals: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        completedGoals: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
          }
        },
        urgentGoals: {
          $sum: {
            $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0]
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalGoals: 0,
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    averageProgress: 0,
    activeGoals: 0,
    completedGoals: 0,
    urgentGoals: 0
  };
};

// Static method to get category breakdown
goalSchema.statics.getCategoryBreakdown = async function(userId) {
  return await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: '$category',
        totalTargetAmount: { $sum: '$targetAmount' },
        totalCurrentAmount: { $sum: '$currentAmount' },
        count: { $sum: 1 },
        averageProgress: { $avg: { $multiply: [{ $divide: ['$currentAmount', '$targetAmount'] }, 100] } }
      }
    },
    {
      $project: {
        category: '$_id',
        totalTargetAmount: 1,
        totalCurrentAmount: 1,
        count: 1,
        averageProgress: { $round: ['$averageProgress', 2] }
      }
    },
    { $sort: { totalTargetAmount: -1 } }
  ]);
};

// Static method to update goal status
goalSchema.statics.updateStatus = async function() {
  const now = new Date();
  
  // Update overdue goals
  await this.updateMany(
    {
      targetDate: { $lt: now },
      status: 'active'
    },
    {
      $set: { status: 'overdue' }
    }
  );
  
  // Update completed goals
  await this.updateMany(
    {
      currentAmount: { $gte: '$targetAmount' },
      status: { $in: ['active', 'overdue'] }
    },
    {
      $set: { status: 'completed' }
    }
  );
};

module.exports = mongoose.model('Goal', goalSchema);
