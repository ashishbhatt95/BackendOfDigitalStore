const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

// OTP Routes
router.post("/send-otp", vendorController.sendOtp);
router.post("/verify-otp", vendorController.verifyOtp);

// Vendor Registration Routes
router.post("/personal-details", vendorController.saveVendorDetails);
router.post("/shop-details", vendorController.saveShopDetails);
router.post("/kyc-details", vendorController.saveKycDetails);
router.post("/bank-details", vendorController.saveBankDetails);
router.post("/submit", vendorController.submitRegistration);

// Update & Get
router.put("/update/:vendorId", vendorController.updateDetails);
router.get("/details/:vendorId", vendorController.getVendorDetails);

module.exports = router;
