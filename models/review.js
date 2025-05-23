const mongoose =  require("mongoose");
const Schema = mongoose.Schema;
const { User } = require("./user.js");


const reviewSchema = new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    comment:String,
   date:{
    type: Date,
    default : Date.now,
   },
   author:{
    type:Schema.Types.ObjectId,
    ref:"User",
   }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
