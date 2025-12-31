const express = require('express');
const router = express.Router();
const axios = require('axios');

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

module.exports = router;