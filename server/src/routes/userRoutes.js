const express = require('express');
const router = express.Router();
const {
  register,
  login,
  updateProfile,
  getUsers,
  updateUserRole,
  getMe
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

// Admin only routes
router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id', protect, authorize('admin'), updateUserRole);

module.exports = router; 