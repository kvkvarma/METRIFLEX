const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Trainers = require("../models/trainers");

router.get("/getuserdetails", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ userDetails: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/gettrainermessages", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // if (!user.trainerAssigned) {
    //   return res
    //     .status(400)
    //     .json({ message: "No trainer assigned to this user" });
    // }
    const trainerMessages = user.trainerMessages || [];
    return res.status(200).json({ trainerMessages: trainerMessages });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/cleartrainermessages", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.trainerMessages = [];
    await user.save();
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/sendmessagetotrainer", async (req, res) => {
  const { trainerId, message } = req.body;
  try {
    const trainer = await Trainers.findOne({ trainerId });
    if (!trainer) {
      return res.status(404).json({ message: "Trainer Not Found" });
    }
    trainer.clinetMessages.push({
      message,
    });
    await trainer.save();
    return res.status(200).json({
      message: "Message Sent Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
