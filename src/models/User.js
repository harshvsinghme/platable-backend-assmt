const mongoose = require("mongoose");

// this is generic schema. It will hold the records of both the user types: donor and recipient
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, //Name
    phone: { type: String, required: true, unique: true }, //Contact
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
