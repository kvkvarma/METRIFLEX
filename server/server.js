const express = require('express');
const connectDB = require('./config/db');   
require('./config/firebaseadmin');
require('dotenv').config();
const app = express();
const port = 8080;
connectDB();
app.get('/',(req,res)=>{
    console.log("Server is Running");
    res.send("Hello from FitMeasure Server");
})
app.get('/login',(req,res)=>{
    
})
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
}); 