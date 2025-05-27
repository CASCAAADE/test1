const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getEventBookings
} = require('../controllers/bookingController');

// Protect all routes after this middleware
router.use(protect);

// Routes
router.post('/:eventId', (req, res) => {
  res.status(200).json({ success: true, message: 'Create booking endpoint' });
});

router.get('/my-bookings', (req, res) => {
  res.status(200).json({ success: true, message: 'Get user bookings endpoint' });
});

router.get('/event/:eventId', (req, res) => {
  res.status(200).json({ success: true, message: 'Get event bookings endpoint' });
});

module.exports = router; 