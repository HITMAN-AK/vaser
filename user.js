const mongoose = require("mongoose");
const {ObjectId} = require("mongodb")
const emplyee = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
    enum: ['laborer', 'engineer', 'mason', 'electrican','plumber',],
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
    default:Date.now(),
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
  },
  skills: {
    type: [String],
    default: [],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
});

const stack = new mongoose.Schema({
    name:String,
    quant:Number,
    unit:String,
    
})

const site = new mongoose.Schema({
    name:String,
    owner:String,
    locaton:String,
    Worker:{type:[ObjectId]},
})

const userschema=new mongoose.Schema({
    name : String,
    uname:{type:String,unique:true},
    pass:String,
    scode:Number,
    noPac:{type:[String],enum:["pac0","pac1","pac2","pac3","pac4"],default:"pac0"},
    emplee:emplyee,

})


module.exports=mongoose.model("user",userschema);
