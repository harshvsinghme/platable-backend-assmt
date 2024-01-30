const foodItemService = require("../services/foodItemService");
const { newError } = require("../utils/utils");
const { isValidObjectId } = require("mongoose");

const addFoodItem = async (req, res) => {
  try {
    //Extract values from request body
    const { name, description, expiryDate, quantity } = req.body;

    //sanity checks(data validations)
    if (!name) {
      throw newError(400, "food item name can not be empty");
    }

    if (!description) {
      throw newError(400, "food item description can not be empty");
    }

    // if date is valid(non-empty and a number)
    if (expiryDate && !isNaN(Number(expiryDate))) {
      // if expiry datetime < current datetime
      if (expiryDate < new Date().getTime()) {
        throw newError(400, "food item expiry date is invalid");
      }
    } else {
      throw newError(400, "food item expiry date can not be empty");
    }

    if (isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      throw newError(400, "food item quantity must be greater than 1");
    }

    const donatedBy = req.user._id; //whoever is logged in, is the donor

    //capture the result of the attempt of adding a food item
    const result = await foodItemService.addFoodItem(
      name,
      description,
      expiryDate,
      quantity,
      donatedBy
    );

    // if addition of item failed
    if (!result.success) throw newError(500, result.message);

    // addition successful
    res.status(201).json(result);
  } catch (error) {
    // fallback aka error handling
    let defaultError = {};

    defaultError.code = error.code ?? 500;
    defaultError.message = error.message ?? "something went wrong";

    res
      .status(defaultError.code)
      .json({ success: false, message: defaultError.message });
  }
};

const getFoodItems = async (req, res) => {
  try {
    //Extract values from request query
    let { donatedBy } = req.query;

    // check if donatedBy filter is there
    if (donatedBy) {
      // validate the value of donatedBy
      if (!isValidObjectId(donatedBy)) {
        throw newError(400, "donor id (donatedBy) is invalid");
      }
    } else {
      donatedBy = null;
    }

    //capture the result of getting the food items
    const result = await foodItemService.getFoodItems(donatedBy);

    // if any error occurs
    if (!result.success) throw newError(500, result.message);

    // processing food items successful
    res.status(200).json(result);
  } catch (error) {
    // fallback aka error handling
    let defaultError = {};

    defaultError.code = error.code ?? 500;
    defaultError.message = error.message ?? "something went wrong";

    res
      .status(defaultError.code)
      .json({ success: false, message: defaultError.message });
  }
};

const getIndividualFoodItem = async (req, res) => {
  try {
    //Extract foodItemId from request params
    const { foodItemId } = req.params;

    // validate the value of foodItemId
    if (!isValidObjectId(foodItemId)) {
      throw newError(400, "food item id (foodItemId) is invalid");
    }

    //capture the result of getting the food items
    const result = await foodItemService.getIndividualFoodItem(foodItemId);

    // if looks like a fail
    if (!result.success) throw newError(500, result.message);

    // process that specific food item
    res.status(200).json(result);
  } catch (error) {
    // fallback aka error handling
    let defaultError = {};

    defaultError.code = error.code ?? 500;
    defaultError.message = error.message ?? "something went wrong";

    res
      .status(defaultError.code)
      .json({ success: false, message: defaultError.message });
  }
};

const updateFoodItem = async (req, res) => {
  try {
    //Extract foodItemId from request params
    const { foodItemId } = req.params;

    // Extract values from request body
    let { name, description, expiryDate, quantity, isDeleted } = req.body;

    //sanity checks(data validations)
    // validate the value of foodItemId
    if (!isValidObjectId(foodItemId)) {
      throw newError(400, "food item id (foodItemId) is invalid");
    }

    name = name ?? null;
    description = description ?? null;

    // if expiry date value is non-empty/non-null
    if (expiryDate) {
      // validate if it is in expected number format
      if (isNaN(Number(expiryDate))) {
        throw newError(400, "food item expiry date (expiryDate) is invalid");
      }

      // if expiry datetime < current datetime
      if (expiryDate < new Date().getTime()) {
        throw newError(
          400,
          "food item expiry date is invalid: (expiryDate): expiryDate must not be before current datetime"
        );
      }
    } else {
      expiryDate = null;
    }

    if (typeof quantity === "number") {
      if (!isNaN(parseInt(quantity))) {
        if (parseInt(quantity) < 0) {
          throw newError(400, "food item quantity must be non-zero");
        } else {
          quantity = parseInt(quantity);
        }
      }
    } else {
      quantity = null;
    }

    if (
      ![null, undefined].includes(isDeleted) &&
      typeof isDeleted !== "boolean"
    ) {
      throw newError(
        400,
        "food item deletion status is invalid: isDeleted: isDeleted must be either true or false"
      );
    }

    //capture the result of updating the food item
    const result = await foodItemService.updateFoodItem(
      req.user._id,
      foodItemId,
      name,
      description,
      expiryDate,
      quantity,
      isDeleted
    );

    // if looks like a fail
    if (!result.success) throw newError(500, result.message);

    // updated that specific food item successfully
    res.status(200).json(result);
  } catch (error) {
    // fallback aka error handling
    let defaultError = {};

    defaultError.code = error.code ?? 500;
    defaultError.message = error.message ?? "something went wrong";

    res
      .status(defaultError.code)
      .json({ success: false, message: defaultError.message });
  }
};

module.exports = {
  addFoodItem,
  getFoodItems,
  getIndividualFoodItem,
  updateFoodItem,
};
