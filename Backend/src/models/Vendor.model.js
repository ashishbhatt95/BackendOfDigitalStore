// models/Vendor.model.js
const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  // Role
  role: { type: String, default: "vendor" },

  // Step 1: OTP
  mobile: { type: String, required: true, unique: true },
  otpVerified: { type: Boolean, default: false },

  // Step 2: Vendor Details
  vendorDetails: {
    fullName: String,
    dob: Date,
    contactNumber: String,
    altContactNumber: String,
    whatsappNumber: String,
    email: String,
    residentialAddress: {
      line1: String,
      line2: String,
      state: String,
      city: String,
      pinCode: String,
    },
    currentAddress: {
      line1: String,
      line2: String,
      state: String,
      city: String,
      pinCode: String,
    },
  },

  // Step 3: Shop Details
  shopDetails: {
    shopName: String,
    username: String,
    shopLogo: String,
    shopCoverImage: String,
    shopRegistrationNumber: String,
    businessType: String,
    address: {
      line1: String,
      line2: String,
      state: String,
      city: String,
      pinCode: String,
    },
    gstNumber: String,
    website: String,
    shopBio: String,
    shopDescription: String,
  },

  // Step 4: KYC
  kycDetails: {
    nameOnDocument: String,
    panNumber: String,
    panCard: String,
    aadharNumber: String,
    aadharFront: String,
    aadharBack: String,
    gstCertificate: String,
    profileImage: String,
    emergencyContactNumber: String,
  },

  // Step 5: Bank
  bankDetails: {
    bankName: String,
    ifscCode: String,
    accountHolderName: String,
    cancelCheque: String,
    accountNumber: String,
    confirmAccountNumber: String,
  },

  // Step 6: Status
  termsAccepted: { type: Boolean, default: false },
  isSubmitted: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vendor", VendorSchema);
