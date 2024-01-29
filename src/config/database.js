const mongoose = require("mongoose");

const connectDB = () => {
  // Database connection is established once for the entire application
  if (mongoose.connections.at(0).readyState) {
    console.log("Already connected");
    return;
  }

  mongoose.connect(process.env.MONGODB_URI);

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });

  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
};

module.exports = { connectDB };
