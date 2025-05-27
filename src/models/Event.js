const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  datetime: {
    type: Date,
    required: [true, 'Please provide event date and time']
  },
  location: {
    type: String,
    required: [true, 'Please provide event location']
  },
  category: {
    type: String,
    required: [true, 'Please provide event category'],
    enum: ['concert', 'conference', 'workshop', 'sports', 'other']
  },
  price: {
    type: Number,
    required: [true, 'Please provide ticket price'],
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide event capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  bookedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for available tickets
eventSchema.virtual('availableTickets').get(function() {
  return this.capacity - this.bookedCount;
});

// Ensure bookedCount doesn't exceed capacity
eventSchema.pre('save', function(next) {
  if (this.bookedCount > this.capacity) {
    next(new Error('Booked count cannot exceed capacity'));
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema); 