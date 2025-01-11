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
        inImg: { type: String,},
        quant: { type: Number, required: true },
        unit: { type: String, required: true },
        drop:{type:Map,of:Number,default:null},
        ship:{type:Map,of:Number,default:null},

    })
);

const site = model(
    "site",
    new Schema({
        name: { type: String, required: true },
        owner: { type: String, required: true },
        location: { type: String, required: true },
        projectSupervisor:Object,
        emplyee: { type: [Types.ObjectId] },
        stock: { type: [Types.ObjectId] },
        req: { type: [Types.ObjectId] },
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
        stock:[Types.ObjectId],
        req:[Types.ObjectId],
        log:[Types.ObjectId]
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
        totalpay:{type:Number,default:0},
        isPresent:{type:Boolean,default:false},
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
        }, emplyee: { type: [String] },
        admin: { type: Types.ObjectId, required: true },
        accessPrevAttendance: Boolean,
        accessAddEmployee: Boolean,
        accessEditSalary: Boolean,
    })
);
const log = model("log",new Schema({
    work:{type:String,require:true},
    by:{type:Types.ObjectId,require:true},
    at:{require:true,default:Date.now,type:Date}
}))
const msg = model("req",new Schema({
     for : {type:String, enum:['mat','att','sal'],required:true},
     work:Object,
    show:Object,
     approve : {type:Boolean,default:null},
     who:{type:Types.ObjectId,required:true},
}) )
module.exports = { admin, emplyee, site, stock, attLog, log, msg };
