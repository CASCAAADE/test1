require('dotenv').config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/event-ticketing',

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Email configuration (for password reset)
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@eventticketing.com'
}; 