const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-ticketing', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected Successfully!`);
    console.log(`Database Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`Database State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
  } catch (error) {
    console.error('MongoDB Connection Error:');
    console.error(`Error Type: ${error.name}`);
    console.error(`Error Message: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 