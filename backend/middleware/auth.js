const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and adds user info to request
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but user no longer exists.'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated.'
        });
      }

      // Add user info to request
      req.user = {
        userId: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired.'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token.'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

/**
 * Optional authentication middleware
 * Similar to auth but doesn't require token
 * Adds user info if token is provided and valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = {
          userId: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        };
      }
    } catch (error) {
      // Token is invalid, but we don't throw an error
      // Just continue without user info
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // For now, we'll implement basic role checking
    // You can extend this based on your user roles
    if (roles.length && !roles.includes('user')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

module.exports = {
  auth,
  optionalAuth,
  authorize
};
