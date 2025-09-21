const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("DB Connection Failed:", err.message);
    process.exit(1); // force exit if DB not connected
  }
};

module.exports = connectDB;
