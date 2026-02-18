const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Trainer = require("../models/trainers");

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

module.exports = router;
