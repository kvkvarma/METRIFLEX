const express = require("express");
const router = express.Router();
const Trainers = require("../models/trainers");
const User = require("../models/users");

router.get("/getTrainers", async (req, res) => {
  try {
    const trainersList = await Trainers.find({ status: "Available" });
    return res.status(200).json({ trainers: trainersList });
  } catch (err) {
    console.error("Error fetching Trainers: ", err.message);
    return res.status(500).json({ error: "Failed to fetch trainers" });
  }
});

router.post("/addrequest", async (req, res) => {
  try {
    const { id, user, name, goal, months, age, proficiency } = req.body;
    console.log(id, user, name, goal, months, age, proficiency);
    const trainer = await Trainers.findOne({ trainerId: id });

    if (!trainer) {
      return res.status(400).json({ message: "Trainer Not Found" });
    }
    trainer.requests.push({
      userId: user,
      name: name,
      plan: months,
      goal,
      age,
      proficiency,
    });
    await Trainers.findOneAndUpdate(
      { trainerId: id },
      { $inc: { totalrequests: 1 } },
    );
    await trainer.save();

    return res.status(201).json({
      message: "Request inserted successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/filltrainerdetails", async (req, res) => {
  try {
    const {
      trainerId,
      name,
      experience,
      speciality,
      description,
      status,
      age,
      gender,
      contact,
    } = req.body;

    const trainer = await Trainers.findOne({ trainerId });

    if (!trainer) {
      return res.status(400).json({ message: "Trainer Not Found" });
    }

    trainer.name = name;
    trainer.experience = experience;
    trainer.speciality = speciality;
    trainer.description = description;
    trainer.status = status;
    trainer.age = age;
    trainer.gender = gender;
    trainer.contact = contact;
    trainer.trainerDetailsFilled = true;
    await trainer.save();

    return res.status(200).json({
      message: "Trainer Details Updated Successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/gettrainerrequests", async (req, res) => {
  try {
    const id = req.query.id;
    const trainer = await Trainers.findOne({ trainerId: id });
    if (!trainer) {
      return res.status(400).json({ message: "Trainer Not Found" });
    }
    const clientRequests = trainer.requests;
    const activeClients = trainer.clients;
    const totalReuqests = trainer.totalrequests;
    const rejectedRequests = trainer.rejectedrequests;
    const totalActiveClients = trainer.totalactiveclients;
    const detailsFetched = trainer.trainerDetailsFilled;

    return res.status(200).json({
      requests: clientRequests,
      activeclients: activeClients,
      totalReuqests: totalReuqests,
      rejectedRequests: rejectedRequests,
      totalActiveClients: totalActiveClients,
      detailsFetched: detailsFetched,
      message: "Requests Fetched Successfully",
    });
  } catch (err) {
    console.log("Error fetch the requests from DB");
    return res
      .status(500)
      .json({ message: "Error finding the Client Requests for thr trainer" });
  }
});

router.post("/addclienttotrainer", async (req, res) => {
  try {
    const { trainerID, userId, name, goal } = req.body;
    const trainer = await Trainers.findOne({ trainerId: trainerID });
    if (!trainer) {
      return res.status(400).json({ message: "Trainer Not Found" });
    }
    trainer.clients.push({
      userId: userId,
      name: name,
      goal: goal,
    });

    await Trainers.findOneAndUpdate(
      { trainerId: trainerID },
      { $inc: { totalactiveclients: 1 } },
    );

    await User.findOneAndUpdate(
      { userId: userId },
      { $set: { trainerAssigned: trainerID } },
    );

    await trainer.save();
    return res.status(200).json({
      newClient: { userId, name, goal },
      message: "Client Assigned Successfully",
    });
  } catch (err) {
    console.log("Error fetching the results");
    return res
      .status(500)
      .json({ message: "Error add the client into the triner clients" });
  }
});

router.post("/messagetoclient", async (req, res) => {
  try {
    const { userId, message } = req.body;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    user.trainerMessages.push({
      id: userId,
      message: message,
    });
    await user.save();
    return res
      .status(200)
      .json({ message: "Message sent to Client Successfully" });
  } catch (err) {
    console.lof("Error sending the message to the client");
    return res
      .status(500)
      .json({ message: "Error sending the message to the client" });
  }
});

router.post("/updateworkoutsplit", async (req, res) => {
  try {
    const { userId, splitGoals } = req.body;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    user.workoutSplit = {
      ...user.workoutSplit,
      ...splitGoals,
    };
    await user.save();
    return res
      .status(200)
      .json({ message: "Workout Split Updated Successfully" });
  } catch (err) {
    console.log("Error updating the workout split");
    return res
      .status(500)
      .json({ message: "Error updating the workout split" });
  }
});

router.post("/removeclientrequest", async (req, res) => {
  try {
    const { trainerID, id } = req.body;
    const trainer = await Trainers.findOne({ trainerId: trainerID });
    if (!trainer) {
      return res.status(400).json({ message: "Trainer Not Found" });
    }
    const requireIndex = trainer.requests.findIndex((req) => {
      return req.userId === id;
    });
    if (requireIndex === -1) {
      return res.status(404).json({ message: "Request not found" });
    }
    trainer.requests.splice(requireIndex, 1);
    await Trainers.findOneAndUpdate(
      { trainerId: trainerID },
      { $inc: { rejectedrequests: 1 } },
    );
    await trainer.save();
    return res
      .status(200)
      .json({ message: "Request removed successfully", res: "true" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
});
module.exports = router;
