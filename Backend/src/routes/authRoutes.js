const express = require("express");
const router = express.Router();
const { loginRequestOtp, verifyLoginOtp } = require("../controllers/AuthController");

// @route   POST /api/auth/login-request-otp
// @desc    Send OTP for login
// @access  Public
router.post("/login-request-otp", loginRequestOtp);

// @route   POST /api/auth/verify-login-otp
// @desc    Verify OTP and login
// @access  Public
router.post("/verify-login-otp", verifyLoginOtp);

module.exports = router;
