const { Types, model, Schema } = require("mongoose");
const emplyee = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      "supervisor",
      "labour",
      "engineer",
      "mason",
      "electrican",
      "plumber",
    ],
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
});

const stock = new Schema({
  name: String,
  quant: Number,
  unit: String,
});

const site = new Schema({
  name: String,
  owner: String,
  locaton: String,
  worker:[String],
  inventory: [String],
  stock: [stock],
});

const userschema = new Schema({
  name: String,
  uname: { type: String, unique: true },
  pass: String,
  scode: Number,
  noPac: { type: Number, enum: [0, 1, 2], default: 0 },
  emplee: [emplyee],
  site: [site],
});
const usr = model("user", userschema);
module.exports.usr = usr;
