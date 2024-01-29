const { Router } = require("express");

const authController = require("../controllers/authController");

const router = Router();

router.get("/get", authController.getController);

module.exports = router;
