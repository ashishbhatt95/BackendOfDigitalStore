const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor.model");
const Superadmin = require("../models/Superadmin");
const Otp = require("../models/Otp");
const { createAndSendOtp } = require("../services/otpService");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Step 1: Request OTP
const loginRequestOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: "Mobile number is required." });

    // Check which role this mobile belongs to
    let user = await User.findOne({ mobile });
    let role = "user";

    if (!user) {
      user = await Vendor.findOne({ mobile });
      role = "vendor";
    }

    if (!user) {
      user = await Superadmin.findOne({ mobile });
      role = "superadmin";
    }

    if (!user) return res.status(400).json({ success: false, message: "Mobile not registered." });

    // Send OTP
    await createAndSendOtp(mobile);

    return res.status(200).json({ success: true, message: "OTP sent successfully.", role });
  } catch (error) {
    console.error("loginRequestOtp error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Step 2: Verify OTP
const verifyLoginOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ success: false, message: "Mobile and OTP are required." });

    // Check OTP
    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // Detect role and fetch user
    let user = await User.findOne({ mobile });
    let role = "user";

    if (!user) {
      user = await Vendor.findOne({ mobile });
      role = "vendor";
    }

    if (!user) {
      user = await Superadmin.findOne({ mobile });
      role = "superadmin";
    }

    if (!user) return res.status(400).json({ success: false, message: "User not found." });

    // Mark vendor otpVerified
    if (role === "vendor" && !user.otpVerified) {
      user.otpVerified = true;
      await user.save();
    }

    // Generate JWT
    const token = generateToken(user._id, role);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      token,
      role,
      user,
    });
  } catch (error) {
    console.error("verifyLoginOtp error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { loginRequestOtp, verifyLoginOtp };
