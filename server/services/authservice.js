const Users = require("../models/users");
const Trainer = require("../models/trainers");
const nodemailer = require("nodemailer");
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

const sendOtp = async (email, uid, username, role, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (role === "user") {
      const user = await Users.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      await sendOtpEmail(email, otp);
      await Users.create({
        userId: uid,
        email: email,
        name: username || "Anonymous",
        role: "user",
      });

      console.log("USER CREATED");
      console.log("OTP sent to USER:", email);
    }

    if (role === "trainer") {
      const trainer = await Trainer.findOne({ email });

      if (trainer) {
        return res.status(400).json({ message: "Trainer already exists" });
      }

      await sendOtpEmail(email, otp);
      await Trainer.create({
        trainerId: uid,
        email: email || decoded.email,
        name: username || "Anonymous",
        role: "trainer",
        description: "",
        experience: 0,
        speciality: "",
      });
      console.log("OTP sent to TRAINER:", email);
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      email,
    });
  } catch (error) {
    console.error("OTP ERROR:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

module.exports = { sendOtp };
