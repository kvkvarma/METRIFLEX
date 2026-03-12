const Users = require("../models/users");
const Trainer = require("../models/trainers");
const nodemailer = require("nodemailer");
const OtpSchema = require("../models/otp");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// send OTP email
const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Verification Code for FitMeasure",
    html: `
      <h3>FitMeasure Email Verification</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire soon.</p>
    `,
  });
};

const sendOtp = async (email, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendOtpEmail(email, otp);
    await OtpSchema.create({
      userEmail: email,
      userOtp: otp,
    });
    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP ERROR:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (email, otp, res) => {
  try {
    const record = await OtpSchema.findOne({ userEmail: email });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.userOtp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OtpSchema.deleteOne({ userEmail: email });

    return res.status(200).json({
      message: "OTP Successfully Verified",
    });
  } catch (err) {
    console.error("OTP ERROR:", err.message);
    return res.status(500).json({ message: "Verification failed" });
  }
};

module.exports = { sendOtp, verifyOtp };
