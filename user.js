const {Types,model,Schema} = require("mongoose");
const emplyee = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
    enum: ['labour', 'engineer', 'mason', 'electrican','plumber',],
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

const stock = new Schema({
    name:String,
    quant:Number,
    unit:String,
    
})

const site = new Schema({
    name:String,
    owner:String,
    locaton:String,
    worker:{type:[Types.ObjectId],validate:{
        validator:(v)=> Types.ObjectId.isValid(v)
    }},
    inventery:{type:[Types.ObjectId]},
})

const userschema=new Schema({
    name : String,
    uname:{type:String,unique:true},
    pass:String,
    scode:Number,
    noPac:{type:Number,enum:[0,1,2],default:0},
    emplee:[emplyee],

})
module.exports.usr=model("user",userschema);
module.exports.emp = model("emp",emplyee);
module.exports.stock=model("stock",stock);
module.exports.site=model("site",site);
