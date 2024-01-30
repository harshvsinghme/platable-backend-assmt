const { Router } = require("express");

const authRoutes = require("./authRoutes");
const foodItemRoutes = require("./foodItemRoutes");

const router = Router();

// Routes
// For Authentication related APIs
router.use("/auth", authRoutes);
// For FoodItem related APIs
router.use("/food-items", foodItemRoutes);

module.exports = router;
