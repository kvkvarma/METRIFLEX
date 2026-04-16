const nodemailer = require("nodemailer");
const OtpSchema = require("../models/otp");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Verification Code for FitMeasure",
    html: `
      <h3>FitMeasure Email Verification</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });
};

// ---------------- SEND OTP ----------------
const sendOtp = async (email, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpSchema.findOneAndUpdate(
      { userEmail: email },
      {
        userOtp: otp,
        createdAt: new Date(),
      },
      { upsert: true, new: true },
    );

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP ERROR:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ---------------- VERIFY OTP ----------------
const verifyOtp = async (email, otp, res) => {
  try {
    const record = await OtpSchema.findOne({ userEmail: email });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    const diff = (new Date() - record.createdAt) / 1000;
    if (diff > 300) {
      await OtpSchema.deleteOne({ userEmail: email });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.userOtp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OtpSchema.deleteOne({ userEmail: email });

    return res.status(200).json({
      message: "OTP successfully verified",
    });
  } catch (err) {
    console.error("OTP ERROR:", err.message);
    return res.status(500).json({ message: "Verification failed" });
  }
};

module.exports = { sendOtp, verifyOtp };
