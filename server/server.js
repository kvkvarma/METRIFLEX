const express = require('express');
const connectDB = require('./config/db'); 
const admin = require('./config/firebaseadmin');
require('dotenv').config();
const cors = require('cors');
const User = require('./models/users');
const app = express();
const port = 8080;
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


app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
}); 

 