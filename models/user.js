const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type:String,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});  

module.exports = mongoose.model("user", User);
