const exp = require('express').Router();
const {admin, emplyee , stock, site, attLog } = require('./db')
exp.post('/cre',async (rq,rs)=>{ // create account 
    try{
    const us = await admin.create(rq.body);
      const su = us.save();
        rs.json(su)
    }catch {
        rs.end(null)
    }
})
exp.get('uck',async (rq,rs)=>{ // root page session chk
    let st = (await admin.findById(rq.headers.auth)).site || (await emplyee.findById(rq.headers.auth)).site;
    rs.json(st);
})
exp.get('/ava',async (rq,rs)=>{ // username chk not implemented
    const usr = await admin.findOne({uname:rq.headers.una}) || await emplyee.findOne({uname:rq.headers.una})
    rs.json(usr);
})
exp.get('/log',async (rq,rs)=>{ // login
    const usr = await admin.findOne({uname:rq.headers.una,pass:rq.headers.pass}) || await emplyee.findOne({uname:rq.headers.una,pass:rq.headers.pass})
    rs.json(usr)
})
exp.get('/proj',async (rq,rs)=>{ // site list
    let st = (await admin.findById(rq.headers.auth)).site || (await emplyee.findById(rq.headers.auth)).site;
    st = st.map(async v=>await site.findById(v));
    rs.json(st);
})
exp.get('/emp',async (rq,rs)=>{ // emplyee list 
    let emp = (await admin.findById(rq.headers.auth)).emplyee || [...(await emplyee.findById(rq.headers.auth)).site.map(async v=>(site.findById(v)).emplyee)];
    emp.map( async v =>await emplyee.findById(v))
    rs.json(emp);
})
exp.post('/emp',async (rq,rs)=>{ // emplyee post
    const emp = await emplyee.findById(rq.headers.auth)
    const id = (await(await emplyee.create(rq.body)).save())._id
    admin.updateOne({_id:rq.headers.aurh},{'$push':{'emplyee': id} })
    emp && emplyee.updateOne({_id:rq.headers.aurh},{'$push':{'emplyee': id} })
    rs.end('')
})
exp.get('/stoc',async (rq,rs)=>{ // stock list
    let stk = (await admin.findById(rq.headers.auth)).site || (await emplyee.findById(rq.headers.aurh)).site;
    let sk = [];
    stk.map(async v => {
        sk[v.name] = v.stock.map(async v=>(await stock.findById(v)));
        return v;
    })
    rs.json(sk);
})
module.exports = exp;
