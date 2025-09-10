const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Returned"],
        default: "Pending",
      },
      sellerEarnings: { type: Number, default: 0 },
      adminCommission: { type: Number, default: 0 },
      refundStatus: {
        type: String,
        enum: ["Not Requested", "Requested", "Approved", "Rejected", "Refunded"],
        default: "Not Requested",
      },
      deliveryDate: { type: Date, default: null },
    }
  ],
  totalPrice: { type: Number, required: true },
  shippingCharge: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  discount: { type: Number, default: 0 },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Wallet", "PhonePe", "Paytm", "Google Pay", "Razorpay", "COD"], // ✅ COD added
  },
  paymentId: {
    type: String,
    required: function() {
      return this.paymentMethod !== "COD"; // ✅ Required only for online payments
    },
  },
  paymentStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Paid", "Failed", "Refunded"],
  },
  transactionId: { type: String, default: null },
  orderStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Partially Shipped", "Completed", "Cancelled"],
  },
  expectedDeliveryDate: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
