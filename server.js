const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const password = encodeURIComponent("Ashwin01012004");
const { usr } = require("./user");
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
  await mongoose
    .connect(
      `mongodb+srv://legendaryairforce:${password}@velxapp.t74pz.mongodb.net/`
    )
    .then(() => {
      console.log("db connect success");
    })
    .catch((err) => {
      console.log("db connect error", err);
    });
}
app.post("/ae",async(req,res)=>{
  const pk = req.headers.auth;
  const owner = req.headers.owner;
  
})
app.post("/log", async (req, res) => {
  const pk = req.body.pk;
  const role = req.body.role;
  if (role == 0) {
    try {
      const id = await usr.findById(pk);
      if (id == null) {
        res.json({ status: false });
        console.log("invalid-user");
      } else {
        res.json({ status: true });
        console.log("valid-user");
      }
    } catch (err) {
      res.json({ status: false });
      console.log("INVALID-USER");
    }
  } else {
    try {
      const id = usr.findOne({ "emplee._id": pk });
      if (id == null) {
        res.json({ status: false });
        console.log("invalid-user");
      } else {
        if (id.role == "supervisor") {
          res.json({ status: true, acc: true });
          console.log("valid-user");
        } else {
          res.json({ status: true, acc: false });
          console.log("valid-user");
        }
      }
    } catch (err) {
      res.json({ status: false });
      console.log("INVALID-USER");
    }
  }
});
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
// ce();
app.listen(2000, "0.0.0.0", () => {
  console.log(`Server running on port`);
});
