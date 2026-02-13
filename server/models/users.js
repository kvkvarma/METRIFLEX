const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    calories : {type: Number, required:false,default:2000},
    protein : {type: Number, required:false,default:100},
    fats : {type: Number, required:false,default:70},
    carbs : {type: Number, required:false,default:250},
    weight : {type: Number, required:false,default:70},
    water : {type: Number, required:false,default:3000},
    steps : {type: Number, required:false,default:10000},
    sleep : {type: Number, required:false,default:8}
});
const workoutSplitSchema = new mongoose.Schema({
    Monday : {type:String,default:"Chest"},
    Tuesday : {type:String,default:"Back"},
    Wednesday : {type:String,default:"Shoulders"},
    Thursday : {type:String,default:"Arms"},
    Friday : {type:String,default:"Legs"},
    Saturday : {type:String,default:"Abs & Cardio"},
    Sunday : {type:String,default:"Rest"},
})

const userSchema =  new mongoose.Schema({

    userId :{type: String, required:true, unique:true},

    name:{type: String, required:true},

    email:{type: String, required:true,unique:true},

    profilePicUrl:{type: String, required:false},

    goal: {
        type: goalSchema,
        default: () => ({}) 
    },
    
    workoutSplit:{
        type : workoutSplitSchema,
        default : ()=>({})
    },

    trainerId:{type: String, required:false,default:null},

    role :{type: String, required:true, default:"user"}

},
{timestamps:true});

module.exports = mongoose.model('User',userSchema);