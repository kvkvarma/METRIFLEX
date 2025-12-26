const mongoose = require('mongoose');
const connectDB = async()=>{
    try{
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
        console.log("DB connected Successfully");
    }
    catch(error){
        console.log("DB not connected");
        console.error(error.message);
        process.exit(1);
    }
}
module.exports = connectDB;