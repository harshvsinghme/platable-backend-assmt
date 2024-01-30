const { Router } = require("express");

const authController = require("../controllers/authController");

const router = Router();

router.post("/user/authenticate", authController.authenticate);

module.exports = router;
