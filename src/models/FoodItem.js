const mongoose = require("mongoose");

// This schema will hold the records about a fooditem which was ever recorded to be donated
const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, //Name
    description: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    donatedBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

module.exports = FoodItem;
