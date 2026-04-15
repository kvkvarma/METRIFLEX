const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Trainers = require("../models/trainers");
const OtpSchema = require("../models/otp");

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
router.get("/getclientname", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ userName: user.name });
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
  console.log("Clear Messages HIT!");
  const { userId } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.trainerMessages = [];
    await user.save();
    return res.status(200).json({
      message: "Trainer messages cleared successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/sendmessagetotrainer", async (req, res) => {
  console.log("send message route hit");
  const { trainerId, message, clientId } = req.body;

  try {
    const trainer = await Trainers.findOne({ trainerId });
    console.log("trainer:", trainer);

    const user = await User.findOne({ userId: clientId });
    console.log("user:", user);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer Not Found" });
    }
    const clientMessage = trainer.clientMessages.find(
      (item) => item.id === clientId,
    );
    if (clientMessage) {
      clientMessage.messages.push(message);
    } else {
      trainer.clientMessages.push({
        id: clientId,
        name: user.name,
        messages: [message],
      });
    }
    await trainer.save();
    res.status(200).json({
      message: "Message Sent Successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
