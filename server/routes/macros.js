const express = require('express');
const router = express.Router();
const axios = require('axios');
const DailyMacros = require('../models/dailymacors');
const users = require('../models/users');

router.get("/getFoodMacros", async (req, res) => {
  try {
    const foodItem = req.query.foodItem;

    if (!foodItem) {
      return res.status(200).json({ message: "No food item provided" });
    }

    const response = await axios.post(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}`,
      { query: foodItem, pageSize: 1 }
    );

    if (!response.data.foods || response.data.foods.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    return res.status(200).json({
      food: response.data.foods[0].description,
      nutrients: response.data.foods[0].foodNutrients
    });
  } catch (err) {
    console.error("USDA API Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch food macros" });
  }
});

router.get('/getDailyMacros', async (req, res) => {
  try {
    const userId = req.query.user;

    if (!userId) {
      return res.status(400).json({ error: "UserID Required!" });
    }

    const dailyMacrosOfUser = await DailyMacros
      .find({ userId })
      .sort({ date: 1 });

    return res.status(200).json({
      userDailyMacrosData: dailyMacrosOfUser
    });
  } catch (err) {
    console.error("Error fetching daily macros:", err.message);
    return res.status(500).json({
      error: "Failed to fetch daily macros"
    });
  }
});

router.get('/getMAcroGoals', async (req, res) => {
  try {
    const userId = req.query.user;

    if (!userId) {
      return res.status(400).json({ error: "UserID Required!" });
    }

    const goalsOfUser = await users.findOne({ userId });

    return res.status(200).json({
      macroGoals: goalsOfUser
    });
  } catch (err) {
    console.error("Error fetching user goals:", err.message);
    return res.status(500).json({
      error: "Failed to fetch user goals"
    });
  }
});

router.post('/addFoodMacros', async (req, res) => {
  try {
    const { macros, userId } = req.body;

    if (!macros || !userId) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const date = new Date().toISOString().split('T')[0];

    await DailyMacros.findOneAndUpdate(
      { userId, date },
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

    return res.status(200).json({
      message: "Food macros added/updated successfully"
    });
  } catch (err) {
    console.error("Error adding macros:", err.message);
    return res.status(500).json({
      error: "Failed to add food macros"
    });
  }
});

module.exports = router;
