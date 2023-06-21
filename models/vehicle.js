const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Vehicle = new Schema({
    name: {
        type: String,
        required: true
        
    },
    serialNumber: {
        type: Number,
        required:true
    },
    type: {
        type: String,
        required:true
    },
//     travels:[{
// name:{
//     type:String,
//     required:true
// },
// TravelNumber:{
//     type:Number,
//     required:true
// },
// SensorsUsed:[{
// type:String,
// required:true
// }],
// MBUsed:{
//     type:Number,
//     required:true
// },
// timeOfTravel:{
//     type:Number,
//     required:true
// },
// Successful:{
//     type:Boolean,
//     required:true
// }
//     }],


    memorySize: {
        type: Number,
    }, 
    batteryCapacity: {
        type:Number
    }, 
    version: {
        type:String,
    },
    sensors: {
        type:String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"user"
    }
})

module.exports = mongoose.model("vehicle", Vehicle);