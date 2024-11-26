const exp = require("express").Router();
const { admin, emplyee, stock, site, attLog } = require("./db");
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
exp.get("/sup",async(rq,rs)=>{
    let sup = (await admin.findById(rq.headers.auth)).emplyee;
    sup = sup ? await emplyee.find({_id:{$in:sup},designation:"Supervisor"}):[];
    rs.json(sup);
    // sup=Promise.all(sup.map(async v=>await emplyee.findOne({_id:v,designation:"Supervisor"})))
})
exp.get("/uck", async (rq, rs) => {
    // root page session chk
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
    usr ? rs.status(400).end('👎'): rs.end("👍");
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
        (await admin.findById(rq.headers.auth)).site ||
            (await emplyee.findById(rq.headers.auth)).site;
    st = await Promise.all(st.map(async (v) => await site.findById(v)));
    rs.json(st);
});
exp.post("/proj",async (rq,rs)=>{
    let ste = await site.create(rq.body);
    ste = await ste.save();
    await emplyee.updateOne({_id:ste.projectSupervisor.value},{$push:{site:ste._id ?? ste.id}})
    await admin.updateOne({_id:rq.headers.auth},{$push:{site:ste._id ?? ste.id}})
    rs.end("👍")
})
exp.put("/proj",async (rq,rs)=>{
    await site.updateOne({_id:rq.headers.edit},{...rq.body});
    const ste = await site.findById(rq.headers.edit); 
    rs.json(ste);
})
exp.get("/emp", async (rq, rs) => {
    // emplyee list
    let emp = (await admin.findById(rq.headers.auth)).emplyee || [
        ...await Promise.all((await emplyee.findById(rq.headers.auth)).site.map(async (v) => site.findById(v).emplyee)),];
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
    rs.end("👍");
});
exp.put("/emp", async (rq, rs) => {
    // emp update
    await emplyee.updateOne({ _id: rq.headers.edit }, rq.body);
    const data = await emplyee.findById(rq.headers.edit);
    rs.json(data);
});
exp.get("/stoc", async (rq, rs) => {
    // stock list
    let stk =
        (await admin.findById(rq.headers.auth)).site ||
            (await emplyee.findById(rq.headers.aurh)).site;
    stk = await Promise.all(stk.map(async (item) => await site.findById(item)))
    stk = await Promise.all(
        stk.map(async (v) => {
            const stock =  await v.stock.map(async v=>await stock.findById(v))
            return {name:v.name,stock};
        }));
    rs.json(stk);
});
exp.get('/projs',async (rq,rs)=>{
    const ck = rq.headers.auth?.split(','); 
    const emp = rq.headers.auth ? await site.find({_id:{$in:ck}}):[];
    rs.json(emp);
})
exp.get('/emps',async (rq,rs)=>{
    const ck = rq.headers.auth?.split(','); 
    const emp = rq.headers.auth? await  emplyee.find({_id:{$in:ck}}):[];
    rs.json(emp);
})
exp.get('/stocs',async (rq,rs)=>{
    const ck = rq.headers.auth?.split(','); 
    const emp = rq.headers.auth ? await stock.find({_id:{$in:ck}}):[];
    rs.json(emp);
})
module.exports = exp;
