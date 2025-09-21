const User = require("../models/User");
const Vendor = require("../models/Vendor.model");
const Superadmin = require("../models/Superadmin");
const { createAndSendOtp } = require("../services/otpService");
const Otp = require("../models/Otp");

// Step 1: Signup - send OTP
exports.signup = async (req, res) => {
  const { name, mobile, role } = req.body;

  if (!mobile || !name || !role) {
    return res.status(400).json({ success: false, message: "Name, mobile and role are required" });
  }

  try {
    // Check if mobile exists in ANY model
    let existing =
      (await User.findOne({ mobile })) ||
      (await Vendor.findOne({ mobile })) ||
      (await Superadmin.findOne({ mobile }));

    if (existing) {
      return res.status(400).json({ success: false, message: "This mobile is already registered" });
    }

    // Send OTP
    await createAndSendOtp(mobile);

    return res.json({ success: true, message: "OTP sent to your mobile" });
  } catch (err) {
    console.error("signup error:", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Step 2: Verify OTP & create user/vendor/superadmin
exports.verifyOtpAndRegister = async (req, res) => {
  const { name, mobile, otp, role } = req.body;

  if (!mobile || !otp || !name || !role) {
    return res.status(400).json({ success: false, message: "Name, mobile, role and OTP are required" });
  }

  try {
    // Again check OTP
    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Double check that mobile is not already registered in any role
    let existing =
      (await User.findOne({ mobile })) ||
      (await Vendor.findOne({ mobile })) ||
      (await Superadmin.findOne({ mobile }));

    if (existing) {
      return res.status(400).json({ success: false, message: "This mobile is already registered" });
    }

    // Create based on role
    let user;
    if (role === "user") {
      user = new User({ name, mobile });
    } else if (role === "vendor") {
      user = new Vendor({ mobile, otpVerified: true, vendorDetails: { fullName: name } });
    } else if (role === "superadmin") {
      user = new Superadmin({ mobile });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    await user.save();

    // Delete OTP after use
    await Otp.deleteMany({ mobile });

    return res.json({ success: true, message: `${role} registered successfully`, user });
  } catch (err) {
    console.error("verifyOtpAndRegister error:", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
