const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Signup: send OTP
router.post("/signup", userController.signup);

// Verify OTP and register user
router.post("/signup/verify", userController.verifyOtpAndRegister);

module.exports = router;
