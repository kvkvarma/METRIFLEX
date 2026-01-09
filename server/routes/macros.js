const express = require('express');
const router = express.Router();
const axios = require('axios');
const DailyMacros = require('../models/dailymacors');


router.get("/getFoodMacros", async (req, res) => {
  try {
    const foodItem = req.query.foodItem;
    if(!foodItem){
      return res.status(200).json({message: "No food item provided" });
    }
    const response = await axios.post(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}`,
      {
        query: foodItem,
        pageSize: 1
      }
    );

    if(!response.data.foods || response.data.foods.length === 0){ 
      return res.status(404).json({ message: "Food not found" });
    }       
    const nutrients = response.data.foods[0].foodNutrients;

    res.status(200).json({
      food: response.data.foods[0].description,
      nutrients: nutrients
    });

  } catch (err) {
    console.error("USDA API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch food macros" });
  }
});


router.get('/getDailyMacros',async(req,res)=>{
  try{
    const userId = req.query.user;
    if(!userId){
      res.status(400).json({error:"UserID Required!"});
    }
    const dailyMacrosOfUser = await DailyMacros.find({userId: userId}).sort({date:1});
    console.log(dailyMacrosOfUser);
    res.status(200).json({userDailyMacrosData : dailyMacrosOfUser})
  }
  catch(err){
    console.error("Error fetching daily macros:", err.message);
    res.status(500).json({ error: "Failed to fetch daily macros" });
  }
})


router.post('/addFoodMacros', async (req, res) => {
  try{
    const { macros, userId } = req.body;
    //Sort using date while retreiving data
    const date = new Date().toISOString().split('T')[0];
    const setMacros = await DailyMacros.findOneAndUpdate(
      { userId: userId, date: date },
      {
        $inc: {
          protein: macros.protein || 0,
          carbs: macros.carbs || 0,
          fats: macros.fats || 0,
          fibre: macros.fibre || 0,
          calories: macros.calories || 0
        }
      },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Food macros added/updated successsfully"});
  }
  catch(err){
    console.error("Error adding macros:", err.message);
    res.status(500).json({ error: "Failed to add food macros" });
  }
});

module.exports = router;