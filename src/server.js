const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Import routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Error:', err.message);
  // Close server & exit process
  process.exit(1);
}); 