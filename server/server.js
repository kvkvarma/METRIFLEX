const express = require('express');
const connectDB = require('./config/db'); 
const admin = require('./config/firebaseadmin');
require('dotenv').config();
const cors = require('cors');
const User = require('./models/users');
const app = express();
const port = 8080;
const axios = require('axios');
connectDB();

app.use(express.json());
app.use(cors()); 


app.get('/',(req,res)=>{
    console.log("Server is Running");
    res.send("Hello from FitMeasure Server");
})


app.post('/register', async (req, res) => {
  try {
    const decoded = await admin.auth().verifyIdToken(req.body.token);
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



app.get("/getFoodMacros", async (req, res) => {
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

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});  