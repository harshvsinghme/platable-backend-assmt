const foodItemService = require("../services/foodItemService");
const { newError } = require("../utils/utils");

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
    const { donatedBy } = req.query;

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

module.exports = { addFoodItem, getFoodItems };
