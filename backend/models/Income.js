const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Income title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    max: [999999.99, 'Amount cannot exceed 999,999.99']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Salary',
      'Freelance',
      'Business',
      'Investment',
      'Rental',
      'Gift',
      'Bonus',
      'Commission',
      'Interest',
      'Dividends',
      'Refund',
      'Other'
    ],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    index: true
  },
  source: {
    type: String,
    trim: true,
    maxlength: [200, 'Source cannot exceed 200 characters']
  },
  paymentMethod: {
    type: String,
    enum: ['Direct Deposit', 'Check', 'Cash', 'Bank Transfer', 'Digital Wallet', 'Other'],
    default: 'Direct Deposit'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    },
    nextDueDate: Date,
    endDate: Date
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
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
incomeSchema.index({ user: 1, date: -1 });
incomeSchema.index({ user: 1, category: 1 });
incomeSchema.index({ user: 1, amount: -1 });
incomeSchema.index({ user: 1, status: 1 });

// Virtual for formatted amount
incomeSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.amount);
});

// Virtual for formatted date
incomeSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to get user's total income
incomeSchema.statics.getTotalIncome = async function(userId, startDate = null, endDate = null) {
  const matchQuery = { user: userId, status: 'active' };
  
  if (startDate || endDate) {
    matchQuery.date = {};
    if (startDate) matchQuery.date.$gte = new Date(startDate);
    if (endDate) matchQuery.date.$lte = new Date(endDate);
  }

  const result = await this.aggregate([
    { $match: matchQuery },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Static method to get income by category
incomeSchema.statics.getIncomeByCategory = async function(userId, startDate = null, endDate = null) {
  const matchQuery = { user: userId, status: 'active' };
  
  if (startDate || endDate) {
    matchQuery.date = {};
    if (startDate) matchQuery.date.$gte = new Date(startDate);
    if (endDate) matchQuery.date.$lte = new Date(endDate);
  }

  return await this.aggregate([
    { $match: matchQuery },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);
};

// Static method to get monthly income
incomeSchema.statics.getMonthlyIncome = async function(userId, year) {
  return await this.aggregate([
    {
      $match: {
        user: userId,
        status: 'active',
        date: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$date' },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Instance method to get income summary
incomeSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    title: this.title,
    amount: this.amount,
    formattedAmount: this.formattedAmount,
    category: this.category,
    description: this.description,
    date: this.date,
    formattedDate: this.formattedDate,
    source: this.source,
    paymentMethod: this.paymentMethod,
    isRecurring: this.isRecurring,
    status: this.status,
    tags: this.tags,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Income', incomeSchema);
