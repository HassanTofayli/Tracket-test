const mongoose=require("mongoose")

const Schema=mongoose.Schema;

const SNCloud=new Schema({
    serialNumber:{
        type:Number
    },
    type: {
        type:String
    },
    memorySize: {
        type:Number,
    },
    batteryCapacity: {
        type:Number,
    },
    version: {
        type:String
    },
    sensors: {
        type:String
    }
})

module.exports=mongoose.model("SNCloud",SNCloud);