const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    console.log('Headers:', req.headers);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found:', token);
    }

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Use the secret from config
      const secret = config.JWT_SECRET;
      console.log('Using JWT secret:', secret);
      
      // Verify token
      const decoded = jwt.verify(token, secret);
      console.log('Decoded token:', decoded);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      console.log('Found user:', user);
      
      if (!user) {
        console.log('No user found with token ID');
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token verification failed'
      });
    }
  } catch (error) {
    console.error('Server error in auth middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorizing user:', req.user);
    console.log('Required roles:', roles);
    console.log('User role:', req.user ? req.user.role : 'No user');
    
    if (!req.user) {
      console.log('No user object found in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log('User role not authorized:', req.user.role);
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    console.log('Authorization successful');
    next();
  };
}; 