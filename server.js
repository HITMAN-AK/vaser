const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const password = encodeURIComponent("Ashwin01012004");
const { usr, att } = require("./user");
app.use(bodyparser.json());
app.use(
  cors({
    origin: "*",
  })
);
main().catch((err) => {
  console.log(err);
});
async function main() {
  await mongoose.connect(`mongodb+srv://legendaryairforce:${password}@velxapp.t74pz.mongodb.net/`).then(() => {console.log("db connect success");}).catch((err) => {console.log("db connect error", err);});
}
function fndId(body,key){
    return body.findIndex((v)=>v._id.toString()==key) 
}
app.post("/at", async (req, res) => {
  const id = await usr.findOne(
    req.headers.role=="0" ? { _id: req.headers.pk } : { "emplee._id": req.headers.pk }
  );
  console.log(req.body);
    req.body.map(async (v)=>{
        await att.updateOne({id:v},{$push:{absent:Date.now}})
    })
    const emp = id.emplee.map(v=>{ if(!req.body.includes(v._id.toString())) return v._id })
    console.log(emp)
    emp.map(async v=>{
        v && await att.updateOne({id:v},{$push : {present:Date.now}})
    })
    res.end('')
});

app.post("/pi", async (req, res) => {
    if (req.body.role != null && req.body.pk != null) {
        const id = await usr.findOne(req.body.role == 0 ? {_id:req.body.pk}:{ "emplee._id": req.body.pk });
        res.json({
            name:  req.body.role == 0 ? id.name.toUpperCase() : id.emplee[fndId(id.emplee,req.body.pk)].name.toUpperCase(),
            role: req.body.role == 0 ? "OWNER": id.emplee[fndId(id.emplee,req.body.pk)].role.toUpperCase(),
        });

    }
});

app.post("/pr", async (req, res) => {
  if (req.body.pk && req.body.role) {
        usr.exists(req.body.role == 0 ?  {_id:req.body.pk}:{'emplee._id' : req.body.pk}).then(e=>{
            res.json({per:e})
        });
  } else {
    res.json({ per: false });
  }
});


app.get("/e", async (req, res) => {
    const ed = await usr.findOne(req.headers.owner == 0?{ _id: req.headers.auth }:{"emplee._id":req.headers.auth});
    res.json({ ed: ed.emplee });
});

app.post("/ae", async (req, res) => {
    const pk = req.headers.auth;
    const owner = req.headers.owner;
    if(!owner){
        res.json({status:false})
        return
    }
    const clust = await usr.findOne(owner == 0 ? {_id:pk}:{"emplee._id":pk})
    clust && usr.updateOne({_id:clust._id},{$push:{emplee:req.body}}).then(async ()=>{
        const nClust = await usr.findOne(owner == 0 ? {_id:pk}:{"emplee._id":pk})
        await att.create({id:nClust.emplee[clust.emplee.length]._id.toString()})
        res.json({status:true})
    })
    clust || res.json({status:false})
});

app.post("/log", async (req, res) => {
  const pk = req.body.pk;
  const role = req.body.role;
    const id = await usr.findOne(role == 0 ? {_id:pk}:{"emplee._id":pk})
    if(id){
        if(role == 0){
            res.json({status:true,acc:true})
            return
        }
        res.json({status:true,acc:id.emplee[fndId(id.emplee,pk)].role == "supervisor"})
    }else{
        res.json({status:false,acc:true})
    }
});

app.post("/site",(rq,rs)=>{
    (rq.headers.owner == 0 || rq.headers.owner == "supervisor") ?
    usr.updateOne(rq.headers.owner == 0 ? {_id:rq.headers.auth}:{"emplee._id":rq.headers.auth},{$push:{ site : rq.body }}).then((r)=>{
            rs.end('') }):
    rs.end(null)
})

app.get("/site",(rq,rs)=>{
    usr.findOne(rq.headers.owner == 0 ? {_id:rq.headers.auth}:{"emplee._id":rq.headers.auth}).then(r=>{
        rs.json(r.site)
    })
})

async function ce() {
  await usr
    .updateOne(
      { _id: "671254444bcb1d84f7e30aa2" },
      {
        $push: {
          emplee: {
            name: "Nithin",
            role: "supervisor",
            salary: 30000,
            phone: 108,
          },
        },
      }
    )
    .then(() => {
      console.log("employee crearted");
    });
}
// cdsfvre sdvdv sefrev ce();
app.listen(2000, "0.0.0.0", () => {
  console.log(`Server running on port`);
});
