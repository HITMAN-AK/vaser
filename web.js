const exp = require("express").Router();
const cron = require("node-cron")
const { admin, emplyee, stock, site, attLog, log, msg} = require("./db");
cron.schedule('0 0 * * *',async ()=>{
    try{
        await emplyee.updateMany({totalpay:{ $gt : 0}},{
            $set :{ totalSalary : {
                $add : ['$totalSalary','$totalpay']
            }}
        });
        await emplyee.updateMany({},{totalpay: 0, isPresent: false })
    }catch {
    }
})
exp.get("/siem", async (req, res) => {
    const sd = await site.findById(req.headers.siteid);
    res.json(sd)
});
exp.post("/cre", async (rq, rs) => {
    // create account
    try {
        const us = await admin.create(rq.body);
        const su = await us.save();
        rs.json(su);
    } catch {
        rs.end(null);
    }
});
exp.get("/sup", async (rq, rs) => {
    let sup = (await admin.findById(rq.headers.auth)).emplyee;
    sup = sup
        ? await emplyee.find({ _id: { $in: sup }, designation: "Supervisor" })
        : [];
    rs.json(sup);
    // sup=Promise.all(sup.map(async v=>await emplyee.findOne({_id:v,designation:"Supervisor"})))
});
exp.get("/uck", async (rq, rs) => {
    // root page session chk
    // await admin.deleteMany({}).then(console.log)
    // await emplyee.deleteMany({}).then(console.log)
    // await site.deleteMany({}).then(console.log)
    // await stock.deleteMany({}).then(console.log)
    // await attLog.deleteMany({}).then(console.log)
    const st =
        (await admin.findById(rq.headers.auth)) ||
            (await emplyee.findById(rq.headers.auth));
    rs.json(st);
});
exp.get("/ava", async (rq, rs) => {
    // username chk not implemented
    const usr =
        (await admin.findOne({ uname: rq.headers.auth })) ||
            (await emplyee.findOne({ uname: rq.headers.auth }));
    usr ? rs.status(400).end("👎") : rs.end("👍");
});
exp.get("/log", async (rq, rs) => {
    // login
    const usr =
        (await admin.findOne({ uname: rq.headers.una, pass: rq.headers.pass })) ||
            (await emplyee.findOne({ uname: rq.headers.una, pass: rq.headers.pass }));
    rs.json(usr);
});
exp.get("/proj", async (rq, rs) => {
    // site list
    let st =
        (await admin.findById(rq.headers.auth))?.site ||
            (await emplyee.findById(rq.headers.auth)).site;
    st = await Promise.all(st.map(async (v) => await site.findById(v)));
    rs.json(st);
});
exp.post("/proj", async (rq, rs) => {
    let ste = await site.create(rq.body);
    ste = await ste.save();
    await emplyee.updateOne(
        { _id: ste.projectSupervisor.value },
        { $push: { site: ste._id ?? ste.id } }
    );
    await admin.updateOne(
        { _id: rq.headers.auth },
        { $push: { site: ste._id ?? ste.id } }
    );
    let l = await log.create({work:`project added Supervisor is ${ste.projectSupervisor.lable}`,by:rq.headers.auth,})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.auth},{$push:{log:l._id || l.id}})
    rs.json(ste);
});
exp.put("/proj", async (rq, rs) => {
    await site.updateOne({ _id: rq.headers.edit }, { ...rq.body });
    const ste = await site.findById(rq.headers.edit);
    let l = await log.create({work:`stock edited name `,by:rq.headers.auth,})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.admin},{$push:{log:l._id || l.id}})
    rs.json(ste);
});
exp.delete('/proj',async (rq,rs)=>{
    await site.deleteOne({_id:rq.headers.edit})
    const emp = await emplyee.findOneAndUpdate({_id:rq.headers.auth},{$pull:{site:rq.headers.edit}})
    await admin.updateOne({_id:emp?.admin || rq.headers.auth},{$pull :{site:rq.headers.edit}})
    let l = await log.create({work:`stock edited name `,by:rq.headers.auth,})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.admin},{$push:{log:l._id || l.id}})
    rs.end("👍")
})

exp.get("/emp", async (rq, rs) => {
    // emplyee list
    let emp = (await admin.findById(rq.headers.auth)).emplyee || [
        ...(await Promise.all(
            (
                await emplyee.findById(rq.headers.auth)
            ).site.map(async (v) => site.findById(v).emplyee)
        )),
    ];
    emp = await Promise.all(emp.map(async (v) => await emplyee.findById(v)));
    rs.json(emp);
});
exp.post("/emp", async (rq, rs) => {
    // emplyee post
    const emp = await emplyee.findById(rq.headers.auth);
    let id = await emplyee.create({
        ...rq.body,
        admin: emp?.admin ?? rq.headers.auth,
    });
    id = await id.save();
    await admin.updateOne(
        { _id: emp?.admin ?? rq.headers.auth },
        { $push: { emplyee: id.id } }
    );
    emp &&
        (await emplyee.updateOne(
            { _id: rq.headers.auth },
            { $push: { emplyee: id.id } }
        ));
    let l = await log.create({work:`employee ${id.name} added username : ${id.uname}`,by:rq.headers.auth,})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.admin},{$push:{log:l._id || l.id}})
    rs.end("👍");
});
exp.put("/emp", async (rq, rs) => {
    // emp update
    await emplyee.updateOne({ _id: rq.headers.edit }, rq.body);
    const data = await emplyee.findById(rq.headers.edit);
    let l = await log.create({work:`stock edited name `,by:rq.headers.auth,})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.admin},{$push:{log:l._id || l.id}})
    rs.json(data);
});
exp.get("/stoc", async (rq, rs) => {
    // stock list
    let stk = (await admin.findById(rq.headers.auth)).stock 
    stk = await Promise.all(stk.map(async (item) => await stock.findById(item)));
    rs.json(stk);
});
exp.post('/stoc',async (rq,rs)=>{
    console.log(rq.headers,rq.body)
    let sto = await stock.create(rq.body)
    sto = await sto.save()
    await admin.updateOne({_id:rq.headers.admin},{$push:{stock:sto._id ?? sto.id}})
    let l = await log.create({work:`stock edited name `,by:rq.headers.auth,})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.admin},{$push:{log:l._id || l.id}})
    rs.json("^")
})
exp.put('/stoc/site/up',async (rq,rs)=>{
const updateObject = { 
            $inc: { quant: -rq.body.quant }, 
            $set: { [`drop.${rq.body.site}`]: rq.body.quant }
        }
    await stock.updateOne({_id:rq.body.stock},updateObject)
    let l = await log.create({work:`update site stock`,by:'admin',})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.admin},{$push:{log:l._id || l.id}})
    rs.end("^")
})
exp.put('/stoc/site',async (rq,rs)=>{
    await site.updateOne({_id:rs.body.site},{$push:{stock:rq.body.stock}})
    const updateObject = { 
            $inc: { quant: -rq.body.quant }, 
            $set: { [`drop.${rq.body.id}`]: rq.body.quant }
        }

    await stock.updateOne( { _id: rq.body.stock},updateObject)
    let l = await log.create({work:`Request accepected`,by:'admin',})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.admin},{$push:{log:l._id || l.id}})
    rs.end("^")
})
exp.put('/stoc',async (rq,rs)=>{
    sto = await stock.findOneAndUpdate({_id:rq.headers.edit},{...rq.body})
    let l = await log.create({work:`stock edited name `,by:rq.headers.auth,})
    l = await l.save();
    await admin.updateOne({_id:rq.headers.admin},{$push:{log:l._id || l.id}})
    rs.json(sto)
})
exp.get("/projs", async (rq, rs) => {
    const ck = rq.headers.auth?.split(",");
    const emp = rq.headers.auth ? await site.find({ _id: { $in: ck } }) : [];
    emp.map((item) => {
        return {...item,quant:item.drop[rq.headers.edit]}
    })
    rs.json(emp);
});
exp.get("/emps", async (rq, rs) => {
    const ck = rq.headers.auth?.split(",");
    const emp = rq.headers.auth ? await emplyee.find({ _id: { $in: ck } }) : [];
    rs.json(emp);
});
exp.get("/stocs", async (rq, rs) => {
    const ck = rq.headers.auth?.split(",");
    const emp = rq.headers.auth ? await stock.find({ _id: { $in: ck } }) : [];
    rs.json(emp);
});
exp.post('/req/mat',async(rq,rs)=>{
    const ms = {for:'mat',
        who:rq.headers.auth,
        work:rq.body
    }
    const id = await(await msg.create(ms)).save()
    await admin.updateOne({_id:rq.headers.admin},{$push:{req:id._id ?? id.id}})
    rs.end("^")
})
module.exports = exp;
