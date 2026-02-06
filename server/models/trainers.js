const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientRequests = new Schema({
    userId : {type : String, required:true},
    name : {type : String},
    goal : {type : String},
    plan : {type : Number},
})

const clientsAssigned = new Schema({
    userId : {type : String, required:true},
    name : {type : String},
    goal : {type : String}
})

const trainerSchema = new Schema({
    trainerId: { type: String, required: true, unique: true },
    name: { type: String },
    experience: { type: Number },
    speciality: { type: String },
    description: { type: String },
    status: { type: String, default: 'active' },

    totalrequests : {type:Number,default:0},
    rejectedrequests : {type:Number,default:0},
    totalactiveclients : {type:Number,default:0},

    clients: { type: [clientsAssigned], default: [] },
    requests : {type : [clientRequests],default:[]}
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);