// controllers/otp.js
const { createAndSendOtp } = require("../services/otpService");
// const User = require("../models/User");
const VendorRegistration = require("../models/Vendor.model");
const Otp = require("../models/Otp");

// Send OTP
exports.sendOtp = async (req, res) => {
  const { mobile, role, name } = req.body;

  try {
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    await createAndSendOtp(mobile);
    

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { mobile, otp, role, name } = req.body;

  try {
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (role === "user") {
      // Customer - permanent record handled in userController
      return res.json({ success: true, message: "OTP verified successfully", verified: true });
    }

    if (role === "vendor") {
      // Vendor - temporary verification, full registration later
      return res.json({ success: true, message: "OTP verified successfully for vendor", verified: true });
    }

    if (role === "superadmin") {
      // Optional: super-admin OTP verification
      return res.json({ success: true, message: "OTP verified successfully for superadmin", verified: true });
    }

    return res.status(400).json({ success: false, message: "Invalid role" });
  } catch (err) {
    console.error("verifyOtp error:", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
