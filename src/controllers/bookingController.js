const Booking = require('../models/Booking');
const Event = require('../models/Event');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/async');

// Create a new booking
exports.createBooking = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const eventId = req.params.eventId;
  const userId = req.user.id;

  // Find the event
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if enough tickets are available
  const existingBookings = await Booking.find({ event: eventId });
  const totalBooked = existingBookings.reduce((sum, booking) => sum + booking.quantity, 0);
  const availableTickets = event.capacity - totalBooked;

  if (quantity > availableTickets) {
    throw new AppError('Not enough tickets available', 400);
  }

  // Calculate total price
  const totalPrice = event.price * quantity;

  // Create booking
  const booking = await Booking.create({
    user: userId,
    event: eventId,
    quantity,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    data: booking
  });
});

// Get user's bookings
exports.getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('event')
    .sort('-bookingDate');

  res.status(200).json({
    success: true,
    data: bookings
  });
});

// Get event's bookings (for organizers)
exports.getEventBookings = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  // Check if user is the event organizer
  if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view these bookings', 403);
  }

  const bookings = await Booking.find({ event: req.params.eventId })
    .populate('user', 'name email')
    .sort('-bookingDate');

  res.status(200).json({
    success: true,
    data: bookings
  });
}); 