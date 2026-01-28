const express = require('express');
const router = express.Router();
const Trainers = require('../models/trainers');
const axios = require('axios');
router.get('/getTrainers',async(req,res)=>{
    try{
        const trainersList = await Trainers.find({status:"active"});
        res.status(200).json({trainers: trainersList});
    }
    catch(err){
        console.error("Error fetching Trainers: ",err.message);
        res.status(500).json({error:"Failed to fetch trainers"})
    }
})
module.exports = router;    