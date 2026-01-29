const express = require('express');
const router = express.Router();
const Trainers = require('../models/trainers');
const axios = require('axios');
const trainers = require('../models/trainers');

router.get('/getTrainers',async(req,res)=>{
    try{
        const trainersList = await Trainers.find({status:"active"});
        return res.status(200).json({trainers: trainersList});
    }
    catch(err){
        console.error("Error fetching Trainers: ",err.message);
        return res.status(500).json({error:"Failed to fetch trainers"})
    }
})

router.post('/addrequest',async(req,res)=>{
    try{
        const {id,user,name,goal,months,age,proficiency} = req.body;
        console.log(id,user,name,goal,months,age,proficiency);
        const trainer = await Trainers.findOne({trainerId : id});
    
        if(!trainer){
            return res.status(400).json({message:"Trainer Not Found"});
        }
        trainer.requests.push({
            userId: user,
            name: name,
            plan: months,
            goal,
            age,
            proficiency,
        })
        await trainer.save();

        return res.status(201).json({
        message: "Request inserted successfully"
    });
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
})

router.get('/gettrainerrequests',async(req,res)=>{
    try{
        const id = req.query.id;
        const trainer = await Trainers.findOne({trainerId:id});
        if(!trainer){
            return res.status(400).json({message:"Trainer Not Found"});
        }
        const clientRequests = trainer.requests;
        return res.status(200).json({requests:clientRequests,message:"Requests Fetched Successfully"});
    }
    catch(err){
        console.log("Error fetch the requests from DB");
        return res.status(500).json({message:"Error finding the Client Requests for thr trainer"});
    }
})

module.exports = router;    