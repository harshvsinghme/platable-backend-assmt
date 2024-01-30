const { Router } = require("express");

const { isAuthenticated } = require("../middlewares/authMiddleware");

const foodItemController = require("../controllers/foodItemController");

const router = Router();

router.post("/add", isAuthenticated, foodItemController.addFoodItem);

module.exports = router;
