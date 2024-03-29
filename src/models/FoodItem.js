const mongoose = require("mongoose");

// This schema will hold the records about a fooditem which was ever recorded to be donated
const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name
    description: { type: String, required: true }, // Description
    expiryDate: { type: Date, required: true }, // Expiry Date
    quantity: { type: Number, required: true }, // Quantity
    donatedBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" }, // Donor(Whoever added this food item)
    // on deletion, we won't actually delete it. We will only turn this flag to true. aka Soft Deletion
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

module.exports = FoodItem;
