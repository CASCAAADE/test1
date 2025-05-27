const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBooking,
  cancelBooking,
  getMyBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Standard user routes
router.use(protect, authorize('standard'));
router.post('/', createBooking);
router.get('/:id', getBooking);
router.delete('/:id', cancelBooking);

router.use(protect);

router.get('/', getMyBookings);
router.put('/:id/cancel', cancelBooking);

module.exports = router; 