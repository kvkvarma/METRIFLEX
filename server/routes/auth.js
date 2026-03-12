const express = require("express");
const router = express.Router();

const admin = require("../config/firebaseAdmin");

const { sendOtp, verifyOtp } = require("../services/authservice");

const User = require("../models/users");
const Trainer = require("../models/trainers");

// ---------------- SEND OTP ----------------

router.post("/sendOtp", async (req, res) => {
  try {
    const { email } = req.body;
    await sendOtp(email, res);
  } catch (err) {
    console.error("OTP FAILED:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/verifyOtp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    await verifyOtp(email, otp, res);
  } catch (err) {
    console.error("OTP Verification:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { token, email, username, role } = req.body;
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;
    if (role === "user") {
      await User.create({
        userId: uid,
        email,
        name: username,
        role: "user",
      });
    }
    if (role === "trainer") {
      await Trainer.create({
        trainerId: uid,
        email,
        name: username,
        role: "trainer",
        description: "",
        experience: 0,
        speciality: "",
      });
    }
    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- USER REGISTER ----------------
// router.post("/register", async (req, res) => {
//   try {
//     const { token, email, username } = req.body;

//     const decoded = await admin.auth().verifyIdToken(token);
//     const uid = decoded.uid;

//     let user = await User.findOne({ userId: uid });

//     if (!user) {
//       user = await User.create({
//         userId: uid,
//         email: email || decoded.email,
//         name: username || "Anonymous",
//         role: "user",
//       });

//       console.log("USER CREATED");
//     }

//     res.status(200).json({ user });
//   } catch (err) {
//     console.error("REGISTER FAILED:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ---------------- TRAINER REGISTER ----------------
// router.post("/trainerregister", async (req, res) => {
//   try {
//     const { token, email, username } = req.body;

//     const decoded = await admin.auth().verifyIdToken(token);
//     const uid = decoded.uid;

//     let trainer = await Trainer.findOne({ trainerId: uid });

//     if (!trainer) {
//       trainer = await Trainer.create({
//         trainerId: uid,
//         email: email || decoded.email,
//         name: username || "Anonymous",
//         role: "trainer",
//         description: "",
//         experience: 0,
//         speciality: "",
//       });

//       console.log("TRAINER CREATED");
//     }

//     res.status(200).json({ trainer });
//   } catch (err) {
//     console.error("TRAINER REGISTER FAILED:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// ---------------- GOOGLE SIGNIN ----------------
router.post("/googleSignin", async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    let user = await User.findOne({ userId: uid });

    if (!user) {
      user = await User.create({
        userId: uid,
        email: decoded.email,
        name: decoded.name || "Anonymous",
        role: "user",
      });

      console.log("USER CREATED VIA GOOGLE");
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("GOOGLE SIGNIN FAILED:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- USER LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const user = await User.findOne({ userId: uid });

    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("LOGIN FAILED:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- TRAINER LOGIN ----------------
router.post("/trainerlogin", async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const trainer = await Trainer.findOne({ trainerId: uid });

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not registered" });
    }

    res.status(200).json({ trainer });
  } catch (err) {
    console.error("TRAINER LOGIN FAILED:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
