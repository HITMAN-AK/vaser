const { Types, model, Schema } = require("mongoose");
const attLog = new Schema({
  id: { type: Types.ObjectId, ref: "user.emplee", required: true },
  status: Boolean,
  present: [],
  absent: [],
  late: [],
});
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
    default: Date.now,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  site: {
    type: [Types.ObjectId],
    ref: "user.site",
  },
});

const stock = new Schema({
  name: { type: String, required: true },
  quant: { type: Number, required: true },
  unit: { type: String, required: true },
});

const site = new Schema({ 
  name: { type: String, required: true },
  owner: { type: String, required: true },
  location: { type: String, required: true },
  worker: { type: [Types.ObjectId], ref: "user.emplee" },
  stock: [stock],
  status: { type: Boolean, default: true },
});

const userschema = new Schema({
  name: { type: String, required: true },
  uname: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  scode: { type: Number, required: true },
  noPac: { type: Number, enum: [0, 1, 2], default: 0 },
  emplee: [emplyee],
  site: [site],
});
const usr = model("user", userschema);
const att = model("Att", attLog);
module.exports.usr = usr;
module.exports.att = att;
