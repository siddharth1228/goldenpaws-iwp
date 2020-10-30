
var mongoose=require("mongoose");

var dogSchema=new mongoose.Schema({
  breed: String,
  price: Number,
  image: String,
  imageId: String,
  email:String,
  location:String,
  description: String,
  phone: String,


  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  rateAvg: Number,
  rateCount: Number,
  hasRated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

});


module.exports=mongoose.model("Dog",dogSchema);