const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/v1/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const { page = 1, category, search, status } = req.query;
    const limit = 9;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Only filter by status if explicitly provided
    if (status) {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      perPage: limit,
      page: parseInt(page),
      events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/v1/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Private (Organizer only)
exports.createEvent = async (req, res, next) => {
  try {
    console.log('CreateEvent Controller:');
    console.log('User:', req.user);
    console.log('Body:', req.body);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found in request'
      });
    }

    if (!req.user.role || !['organizer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to create events`
      });
    }

    req.body.organizer = req.user.id;
    
    const event = await Event.create(req.body);
    console.log('Created event:', event);

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Error in createEvent:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private (Organizer only)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private (Organizer only)
exports.deleteEvent = async (req, res, next) => {
  try {
    // First find the event to check authorization
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Delete the event using findOneAndDelete
    const deletedEvent = await Event.findOneAndDelete({ _id: req.params.id });

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    next(error);
  }
};

// @desc    Get organizer events
// @route   GET /api/v1/events/my-events
// @access  Private (Organizer only)
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events (including pending and declined)
// @route   GET /api/v1/events/all
// @access  Admin
exports.getAllEvents = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organizer's events analytics
// @route   GET /api/v1/users/events/analytics
// @access  Event Organizer
exports.getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    
    const analytics = events.map(event => ({
      eventId: event._id,
      title: event.title,
      totalTickets: event.totalTickets,
      remainingTickets: event.remainingTickets,
      bookingPercentage: event.bookingPercentage
    }));

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 