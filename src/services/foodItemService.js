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

const updateFoodItem = async (
  currentUserId,
  foodItemId,
  name,
  description,
  expiryDate,
  quantity,
  isDeleted
) => {
  let response = { success: false, message: "" };

  // process specific food item by id
  const foodItemRecord = await FoodItem.findById(foodItemId);

  // if food item record exists as well as currently logged in user must be the donor of the item
  // as he/she can only edit his/her food item. none else is allowed to edit someone else's food item
  if (foodItemRecord) {
    if (foodItemRecord.donatedBy.toString() !== currentUserId.toString()) {
      response.message =
        "you are not authorized to update this food item: only donor of this item can update this";
      return response;
    }
    // user can only edit following properties. for example, a user can't change donor id of food item.
    if (name) foodItemRecord.name = name;
    if (description) foodItemRecord.description = description;
    if (expiryDate) foodItemRecord.expiryDate = expiryDate;
    if (quantity !== null) foodItemRecord.quantity = quantity;
    if (![null, undefined].includes(isDeleted)) {
      foodItemRecord.isDeleted = isDeleted;
    }

    await foodItemRecord.save();

    // if above operation successful then, set success response
    response.success = true;
    response.message = "food item updated successfully";
  } else {
    response.message = "no such food item exists";
  }

  return response;
};

const deleteIndividualFoodItem = async (currentUserId, foodItemId) => {
  let response = { success: false, message: "" };

  // process specific food item by id
  const foodItemRecord = await FoodItem.findById(foodItemId);

  // if food item record exists as well as currently logged in user must be the donor of the item
  // as he/she can only delete his/her food item. none else is allowed to delete someone else's food item
  if (foodItemRecord) {
    if (foodItemRecord.donatedBy.toString() !== currentUserId.toString()) {
      response.message =
        "you are not authorized to delete this food item: only donor of this item can delete this";
      return response;
    }

    // mark as deleted(soft delete for data persistence)
    foodItemRecord.isDeleted = true;

    // save updated document
    await foodItemRecord.save();

    // if above operation successful then, set success response
    response.success = true;
    response.message = "food item deleted successfully";
  } else {
    response.message = "no such food item exists";
  }

  return response;
};

module.exports = {
  addFoodItem,
  getFoodItems,
  getIndividualFoodItem,
  updateFoodItem,
  deleteIndividualFoodItem,
};
