const mongoose = require("mongoose");
const userschema=new mongoose.Schema({
    name : String,
    uname:{type:String,unique:true},
    pass:String,
    scode:Number,
    pac:Number
})
module.exports=mongoose.model("user",userschema);