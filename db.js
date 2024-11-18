const { Types, model, Schema } = require("mongoose");

const attLog = model(
  "attLog",
  new Schema({
    id: { type: Types.ObjectId, required: true },
    status: Boolean,
    present: [],
    absent: [],
    log: [],
  })
);

const stock = model(
  "stock",
  new Schema({
    name: { type: String, required: true },
    quant: { type: Number, required: true },
    unit: { type: String, required: true },
  })
);

const site = model(
  "site",
  new Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    location: { type: String, required: true },
    emplyee: { type: [Types.ObjectId] },
    stock: { type: [Types.ObjectId] },
    status: { type: Boolean, default: true },
  })
);
const admin = model(
  "admin",
  new Schema({
    name: { type: String, required: true },
    uname: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    noPac: { type: Number, enum: [0, 1, 2], default: 0 },
    emplyee: { type: [String] },
    site: { type: [Types.ObjectId] },
    accessPrevAttendance: Boolean,
    accessAddEmployee: Boolean,
    accessEditSalary: Boolean,
  })
);

const emplyee = model(
  "emplyee",
  new Schema({
    name: {
      type: String,
      required: true,
    },
    uname: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    noPac: { type: Number, enum: [0, 1, 2], default: 0 },
    designation: {
      type: String,
      required: true,
    },
    salaryPerShift: {
      type: Number,
      required: true,
    },
    totalSalary: Number,
    dateOfJoining: {
      type: Date,
      required: true,
      default: Date.now,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    site: {
      type: [Types.ObjectId],
    },
    admin: { type: Types.ObjectId, required: true },
    accessPrevAttendance: Boolean,
    accessAddEmployee: Boolean,
    accessEditSalary: Boolean,
  })
);
module.exports = { admin, emplyee, site, stock, attLog };
