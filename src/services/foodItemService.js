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

const getFoodItems = async (donatedBy) => {
  let response = { success: false, foodItems: [] };
  let filterCond = {
    //this default value makes sure that a deleted item is always excluded
    isDeleted: false,
  };

  // check if donatedBy filter is there
  if (donatedBy) {
    // include donatedBy in filters of processing food items when we are sure about validity of donatedBy value
    filterCond.donatedBy = donatedBy;
  }

  // process food items
  response.foodItems = await FoodItem.find(filterCond)
    .populate("donatedBy", "-password -createdAt -updatedAt -__v")
    .select("-isDeleted -__v");

  // if food items were processed successfully, set response to success
  response.success = true;

  return response;
};

const getIndividualFoodItem = async (foodItemId) => {
  let response = { success: false };

  // process specific food item by id
  const foodItemRecord = await FoodItem.findById(foodItemId)
    .populate("donatedBy", "-password -createdAt -updatedAt -__v")
    .select("-__v")
    .lean();

  // if food item record exists as well as has not been deleted(isDeleted: false)
  if (foodItemRecord && !foodItemRecord.isDeleted) {
    response.success = true;
    delete foodItemRecord["isDeleted"];
    response.foodItem = foodItemRecord;
  } else {
    response.message = "no such food item exists";
  }

  return response;
};

module.exports = { addFoodItem, getFoodItems, getIndividualFoodItem };
