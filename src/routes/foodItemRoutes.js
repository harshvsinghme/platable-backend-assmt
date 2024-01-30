const { Router } = require("express");

const { isAuthenticated } = require("../middlewares/authMiddleware");

const foodItemController = require("../controllers/foodItemController");

const router = Router();

// Routes
// Add New Food Item
router.post("/", isAuthenticated, foodItemController.addFoodItem);
// Get {1, N} Food Item(s) based on filters
router.get("/", foodItemController.getFoodItems);
//Get Specific Food Item based on Food Item Id
router.get("/:foodItemId", foodItemController.getIndividualFoodItem);
// Update Specific Food Item based on Food Item Id
router.put("/:foodItemId", isAuthenticated, foodItemController.updateFoodItem);
// Delete Specific Food Item based on Food Item Id
// router.delete("/:foodItemId", isAuthenticated, foodItemController.addFoodItem);

module.exports = router;
