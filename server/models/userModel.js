const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        require: [true, "Please add your name"],
      },
      email: {
        type: String,
        require: [true, "Please add your email"],
        unique: true,
      },
      phoneNumber:{
        type:String,
        require:[true, "Please add your phone number"],
      },
      password: {
        type: String,
        require: [true, "Please add your password"],
      }
    },
    {
      timestamps: true, 
    }
  );
  
  module.exports = mongoose.model("User", userSchema);
  