const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';  // Fallback to default if no env variable is provided
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the app if MongoDB connection fails
  }
};

module.exports = { connectDB };
