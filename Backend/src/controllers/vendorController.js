const Vendor = require("../models/Vendor.model");
const User = require("../models/User");
const Superadmin = require("../models/Superadmin");
const Otp = require("../models/Otp");
const { createAndSendOtp } = require("../services/otpService");

// --- SEND OTP ---
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    // Check if mobile already registered in User, Vendor (submitted), Superadmin
    const existingUser = await User.findOne({ mobile });
    const existingSuperadmin = await Superadmin.findOne({ mobile });
    const existingVendor = await Vendor.findOne({ mobile });

    if (existingUser || existingSuperadmin || (existingVendor && existingVendor.isSubmitted)) {
      return res.status(400).json({
        success: false,
        message: "This mobile is already registered",
      });
    }

    // Only send OTP, do NOT create Vendor yet
    await createAndSendOtp(mobile);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Check OTP
    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check if vendor already exists
    let vendor = await Vendor.findOne({ mobile });
    if (!vendor) {
      // Create Vendor record only after OTP verified
      vendor = new Vendor({ mobile, otpVerified: true });
      await vendor.save();
    } else {
      vendor.otpVerified = true;
      await vendor.save();
    }

    // Delete OTP
    await Otp.deleteMany({ mobile });

    return res.json({
      success: true,
      vendorId: vendor._id,
      message: "OTP verified & Vendor created",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- VENDOR REGISTRATION STEPS ---
exports.saveVendorDetails = async (req, res) => {
  try {
    const { vendorId, vendorDetails } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    vendor.vendorDetails = vendorDetails;
    await vendor.save();

    return res.json({ success: true, message: "Vendor details saved" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveShopDetails = async (req, res) => {
  try {
    const { vendorId, shopDetails } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    vendor.shopDetails = shopDetails;
    await vendor.save();

    return res.json({ success: true, message: "Shop details saved" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveKycDetails = async (req, res) => {
  try {
    const { vendorId, kycDetails } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    vendor.kycDetails = kycDetails;
    await vendor.save();

    return res.json({ success: true, message: "KYC details saved" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveBankDetails = async (req, res) => {
  try {
    const { vendorId, bankDetails } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    vendor.bankDetails = bankDetails;
    await vendor.save();

    return res.json({ success: true, message: "Bank details saved" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitRegistration = async (req, res) => {
  try {
    const { vendorId } = req.body;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    vendor.termsAccepted = true;
    vendor.isSubmitted = true;
    await vendor.save();

    return res.json({ success: true, message: "Registration submitted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --- UPDATE / GET ---
exports.updateDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const updateData = req.body;

    const vendor = await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    return res.json({ success: true, vendor, message: "Vendor updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getVendorDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    return res.json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
