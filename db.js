const { Types, model, Schema } = require("mongoose");
const attLog = model('attLog',new Schema({
    id: { type: Types.ObjectId, ref: "emplyee", required: true },
    status: Boolean,
    present: [],
    absent: [],
    log: [],
}));
const stock = model('stock',new Schema({
    name: { type: String, required: true },
    quant: { type: Number, required: true },
    unit: { type: String, required: true },
}));

const site = model('site',new Schema({ 
    name: { type: String, required: true },
    owner: { type: String, required: true },
    location: { type: String, required: true },
    emplyee: { type: [Types.ObjectId], ref: "emplyee" },
    stock: {type:[Types.ObjectId],ref:'stock'},
    status: { type: Boolean, default: true },
}));
const admin = model('admin',new Schema({
    name: { type: String, required: true },
    uname: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    noPac: { type: Number, enum: [0, 1, 2], default: 0 },
    emplyee: { type:[Types.ObjectId],ref:'emplyee'},
    site: { type:[Types.ObjectId],ref:'site'},
}));
const emplyee = model('emplyee' ,new Schema({
    name: {
        type: String,
        required: true,
    },
    uname: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    noPac: { type: Number, enum: [0, 1, 2], default: 0 },
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
    acess:{type:[Boolean],default:[false,false,false]},
    salaryshift: {
        type: Number,
        required: true,
    },
    salary:Number,
    dateOfJoining: {
        type: Date,
        required: true,
        default: Date.now,
    },
    email: {
        type: String,
        unique: true,
    },
    site: {
        type: [Types.ObjectId],
        ref: "site",
    },
    admin:{type:Types.ObjectId,required:true}
}));
module.exports = {admin,emplyee,site,stock,attLog}

