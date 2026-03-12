const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userOtp: { type: Number, required: true },
});

module.exports = mongoose.model("OtpSchema", otpSchema);
