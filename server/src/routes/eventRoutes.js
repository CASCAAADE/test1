const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const { createBooking } = require('../controllers/bookingController');

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('Event Route Debug:');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Protected Organizer routes - these need authentication
router.get('/my-events', protect, authorize('organizer', 'admin'), getMyEvents);

// Create event route with separate middleware for better debugging
router.post('/', 
  (req, res, next) => {
    console.log('Before protect middleware - Headers:', req.headers);
    next();
  },
  protect,
  (req, res, next) => {
    console.log('After protect middleware - User:', req.user);
    next();
  },
  authorize('organizer', 'admin'),
  (req, res, next) => {
    console.log('After authorize middleware - Proceeding to create event');
    next();
  },
  createEvent
);

router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

// Protected route for creating bookings
router.post('/:id/book',
  (req, res, next) => {
    console.log('Booking Debug:');
    console.log('Event ID:', req.params.id);
    console.log('User:', req.user);
    console.log('Request Body:', req.body);
    next();
  },
  protect,
  createBooking
);

// Public routes - these should be last
router.get('/', getEvents);
router.get('/:id', getEvent);

module.exports = router; 