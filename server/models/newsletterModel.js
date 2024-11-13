const mongoose = require("mongoose");

const newsLetterSchema = mongoose.Schema(
    {
      title: {
        type: String,
        require: [true, "Please add Title"],
      },
      author: {
        type: String,
        require: [true, "Please add author name"],
      },
      date:{
        type:String,
        require:[true, "Please add date"],
      },
      imageUrl: {
        type: String,
        require: [true, "Please add imageUrl"],
      },
      
      description: {
        type: String,
        require: [true, "Please add Newsletter Description"],
      }
    },
    {
      timestamps: true, 
    }
  );
  
  module.exports = mongoose.model("Newsletter", newsLetterSchema);
  