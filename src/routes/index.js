const { Router } = require("express");

const authRoutes = require("./authRoutes");
const foodItemRoutes = require("./foodItemRoutes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/food-item", foodItemRoutes);

module.exports = router;
