const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Create new booking
// @route   POST /api/v1/events/:eventId/book
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const { quantity } = req.body;

    // Check if enough tickets are available
    if (event.bookedCount + quantity > event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough tickets available'
      });
    }

    // Create booking
    const booking = await Booking.create({
      event: event._id,
      user: req.user.id,
      quantity,
      totalPrice: event.price * quantity
    });

    // Update event booked count
    event.bookedCount += quantity;
    await event.save();

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/v1/bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'title datetime location image price'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'event',
        select: 'title datetime location image price'
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user owns booking
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user owns booking
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update event booked count
    const event = await Event.findById(booking.event);
    event.bookedCount -= booking.quantity;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
}; 