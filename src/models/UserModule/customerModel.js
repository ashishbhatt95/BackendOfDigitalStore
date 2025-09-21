const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    isVerified: { type: Boolean, default: false },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    role: { type: String, default: "customer" },
    otp: { type: String },
    otpCreatedAt: { type: Date, default: Date.now, index: { expires: "120s" } },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;