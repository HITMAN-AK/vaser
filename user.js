const mongoose,{Types} = require("mongoose");
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
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
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

const stock = new mongoose.Schema({
    name:String,
    quant:Number,
    unit:String,
    
})

const site = new mongoose.Schema({
    name:String,
    owner:String,
    locaton:String,
    worker:{type:[Types.ObjectId],validate:{
        validator:(v)=> Types.ObjectId.isValid(v)
    }},
    inventery:{type:[Types.ObjectId]},
})

const userschema=new mongoose.Schema({
    name : String,
    uname:{type:String,unique:true},
    pass:String,
    scode:Number,
    noPac:{type:Number,enum:[0,1,2],default:0},
    emplee:[emplyee],

})
module.exports.usr=mongoose.model("user",userschema);
module.exports.emp = mongoose.module("emp",emplyee);
module.exports.stock=mongoose.model("stock",stock);
module.exports.usr=mongoose.model("site",site);
