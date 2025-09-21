// models/Superadmin.model.js
const mongoose = require("mongoose");

const SuperadminSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  role: { type: String, default: "superadmin" }
});

module.exports = mongoose.model("Superadmin", SuperadminSchema);
