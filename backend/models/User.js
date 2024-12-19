const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  profilePicture: {
    type: String,
    default: null
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
      spendingReminders: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      default: 'light',
      enum: ['light', 'dark', 'auto']
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'hi']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for user's total expenses
userSchema.virtual('totalExpenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'user',
  pipeline: [
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ],
  justOne: true
});

// Virtual for user's total income
userSchema.virtual('totalIncome', {
  ref: 'Income',
  localField: '_id',
  foreignField: 'user',
  pipeline: [
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ],
  justOne: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user profile (without sensitive data)
userSchema.methods.getProfile = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    profilePicture: this.profilePicture,
    currency: this.currency,
    timezone: this.timezone,
    preferences: this.preferences,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find user by username
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username });
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'expenses',
        localField: '_id',
        foreignField: 'user',
        as: 'expenses'
      }
    },
    {
      $lookup: {
        from: 'incomes',
        localField: '_id',
        foreignField: 'user',
        as: 'incomes'
      }
    },
    {
      $project: {
        totalExpenses: { $sum: '$expenses.amount' },
        totalIncome: { $sum: '$incomes.amount' },
        expenseCount: { $size: '$expenses' },
        incomeCount: { $size: '$incomes' },
        netBalance: { $subtract: [{ $sum: '$incomes.amount' }, { $sum: '$expenses.amount' }] }
      }
    }
  ]);

  return stats[0] || {
    totalExpenses: 0,
    totalIncome: 0,
    expenseCount: 0,
    incomeCount: 0,
    netBalance: 0
  };
};

module.exports = mongoose.model('User', userSchema);
