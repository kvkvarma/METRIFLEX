const mongoose = require('mongoose');
const trainerSchema = new mongoose.Schema({
    trainerId:{type:String,required:true,unique:true},
    name:{type:String},
    experience:{type:Number},
    speciality:{type:String},
    description:{type:String},
    status:{type:String,default:"active"},
    clients:[
        {
            clientId:{type:String},
            name:{type:String},
            progress:{type:Array,default:[]},
            goal:{type:String}
        }
    ]
})
module.exports = mongoose.model('Trainer', trainerSchema);