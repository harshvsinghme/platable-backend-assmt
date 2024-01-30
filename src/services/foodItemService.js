const FoodItem = require("../models/FoodItem");

const addFoodItem = async (
  name,
  description,
  expiryDate,
  quantity,
  donatedBy
) => {
  let response = { success: false, message: "" };

  await FoodItem.create({ name, description, expiryDate, quantity, donatedBy });
  response.success = true;
  response.message = "added food item successfully";

  return response;
};

module.exports = { addFoodItem };
