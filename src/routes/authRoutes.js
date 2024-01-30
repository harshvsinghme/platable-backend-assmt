const { Router } = require("express");

const authController = require("../controllers/authController");

const router = Router();

// Routes
// API for authentication, if user exists then I logs the user in. else, it registers user and logs the user in.
router.post("/user/authenticate", authController.authenticate);

module.exports = router;
