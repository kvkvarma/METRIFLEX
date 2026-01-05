const express = require('express');
const router = express.Router();
const admin = require('../config/firebaseAdmin');
const User = require('../models/users');

router.post('/register', async (req, res) => {
  try {
    const decoded = await admin.auth().verifyIdToken(req.body.token);
    if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
    }
    const uid = decoded.uid;
    let user = await User.findOne({ userId: uid });
    if (!user) {
      user = await User.create({
        userId: uid,
        email: req.body.email,
        name: req.body.username || "Anonymous",
        role: req.body.role || "user"
      });
      console.log("USER CREATED");
    }
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("FAILED:", err.message);
    res.status(401).json({ error: err.message });
  }
});


router.post('/googleSignin',async(req,res)=>{
    try{
        const decoded = await admin.auth().verifyIdToken(req.body.token);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
        }
        const uid = decoded.uid;
        let user = await User.findOne({ userId: uid });
        if (!user) {
          user = await User.create({
            userId: uid,
            email: decoded.email,
            name: decoded.name || "Anonymous",
            role: "user"
          });
          console.log("USER CREATED VIA GOOGLE SIGNIN");
        }
        res.status(200).json({ user });
    }
    catch(err){
        console.error("FAILED:", err.message);
        res.status(401).json({ error: err.message });
    }
});

router.post('/login',async(req,res)=>{
    try{
        const decoded = await admin.auth().verifyIdToken(req.body.token);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
        }
        const uid = decoded.uid;
        const user = await User.findOne({userId : uid});
        if(!user){
          res.status(404).json({message: "User not found"});
        }
        else{
            res.status(200).json({user});
        }
    }
    catch(err){
        console.error("FAILED:", err.message);
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;