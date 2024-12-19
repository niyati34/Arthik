const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
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
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'check', 'other'],
    default: 'cash'
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  receipt: {
    url: String,
    filename: String,
    uploadedAt: Date
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
    nextDueDate: Date,
    endDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
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
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, amount: -1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.amount);
});

// Virtual for formatted date
expenseSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for relative time
expenseSchema.virtual('relativeTime').get(function() {
  const now = new Date();
  const diffInMs = now - this.date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
});

// Pre-save middleware to ensure type is 'expense'
expenseSchema.pre('save', function(next) {
  this.type = 'expense';
  next();
});

// Instance method to get expense summary
expenseSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    amount: this.amount,
    formattedAmount: this.formattedAmount,
    category: this.category,
    date: this.date,
    formattedDate: this.formattedDate,
    relativeTime: this.relativeTime,
    paymentMethod: this.paymentMethod,
    status: this.status,
    tags: this.tags,
    createdAt: this.createdAt
  };
};

// Static method to get expenses by category
expenseSchema.statics.getByCategory = function(userId, category) {
  return this.find({ user: userId, category: category }).sort({ date: -1 });
};

// Static method to get expenses by date range
expenseSchema.statics.getByDateRange = function(userId, startDate, endDate) {
  return this.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Static method to get expense statistics
expenseSchema.statics.getStats = async function(userId, startDate = null, endDate = null) {
  const matchStage = { user: mongoose.Types.ObjectId(userId) };
  
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        averageAmount: { $avg: '$amount' },
        minAmount: { $min: '$amount' },
        maxAmount: { $max: '$amount' }
      }
    }
  ]);

  return stats[0] || {
    totalAmount: 0,
    count: 0,
    averageAmount: 0,
    minAmount: 0,
    maxAmount: 0
  };
};

// Static method to get category breakdown
expenseSchema.statics.getCategoryBreakdown = async function(userId, startDate = null, endDate = null) {
  const matchStage = { user: mongoose.Types.ObjectId(userId) };
  
  if (startDate && endDate) {
    matchStage.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        average: { $avg: '$amount' }
      }
    },
    {
      $project: {
        category: '$_id',
        total: 1,
        count: 1,
        average: { $round: ['$average', 2] },
        percentage: {
          $multiply: [
            { $divide: ['$total', { $sum: '$total' }] },
            100
          ]
        }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

// Static method to get monthly trends
expenseSchema.statics.getMonthlyTrends = async function(userId, months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        total: 1,
        count: 1,
        monthName: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id.month', 1] }, then: 'January' },
              { case: { $eq: ['$_id.month', 2] }, then: 'February' },
              { case: { $eq: ['$_id.month', 3] }, then: 'March' },
              { case: { $eq: ['$_id.month', 4] }, then: 'April' },
              { case: { $eq: ['$_id.month', 5] }, then: 'May' },
              { case: { $eq: ['$_id.month', 6] }, then: 'June' },
              { case: { $eq: ['$_id.month', 7] }, then: 'July' },
              { case: { $eq: ['$_id.month', 8] }, then: 'August' },
              { case: { $eq: ['$_id.month', 9] }, then: 'September' },
              { case: { $eq: ['$_id.month', 10] }, then: 'October' },
              { case: { $eq: ['$_id.month', 11] }, then: 'November' },
              { case: { $eq: ['$_id.month', 12] }, then: 'December' }
            ],
            default: 'Unknown'
          }
        }
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]);
};

module.exports = mongoose.model('Expense', expenseSchema);
