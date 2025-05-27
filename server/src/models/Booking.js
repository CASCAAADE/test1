const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify number of tickets'],
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total price before saving
bookingSchema.pre('save', async function(next) {
  if (!this.isModified('quantity')) return next();
  
  try {
    const event = await this.model('Event').findById(this.event);
    this.totalPrice = this.quantity * event.price;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Booking', bookingSchema); 