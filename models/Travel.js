const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Travel = new Schema({
    name: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        required: true,
    },
    distance: {
        type:Number,
    },
    duration: {
        type: Number,
    },
    timeForLaunch: {
        type: Number,
        required:true,
    },
    route: {
        type: String,
        required: true,
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"vehicle"
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'user',
    },
    
})
module.exports = mongoose.model("Travel", Travel);