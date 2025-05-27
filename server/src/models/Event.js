const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title']
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description']
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
    min: 0
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide event capacity'],
    min: 1
  },
  bookedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'  // Setting default to approved since we didn't have approval flow before
  },
  image: {
    type: String
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema); 