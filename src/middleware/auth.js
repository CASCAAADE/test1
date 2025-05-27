const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('./async');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new AppError('User not found', 401));
    }

    next();
  } catch (err) {
    return next(new AppError('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

module.exports = { protect, authorize }; 