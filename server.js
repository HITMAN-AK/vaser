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
app.post("/pr", async (req, res) => {
  if (req.body.pk && req.body.role) {
    if (req.body.role == "0") {
      try {
        const e = await usr.exists({ _id: req.body.pk });
        if (e) {
          res.json({ per: true });
        } else {
          res.json({ per: false });
        }
      } catch {
        res.json({ per: false });
      }
    } else {
      try {
        const e = await usr.exists({ "emplee._id": req.body.pk });
        if (e) {
          res.json({ per: true });
        } else {
          res.json({ per: false });
        }
      } catch {
        res.json({ per: false });
      }
    }
  } else {
    res.json({ per: false });
  }
});
app.get("/e", async (req, res) => {
  if (req.headers.owner == 0) {
    const ed = await usr.findOne({ _id: req.headers.auth });
    console.log(ed.emplee);
    res.json({ ed: ed.emplee });
  } else {
    const ed = await usr.findOne({ "emplee._id": req.headers.auth });
    res.json({ ed: ed.emplee });
    console.log(ed.emplee);
  }
});
app.post("/ae", async (req, res) => {
  const pk = req.headers.auth;
  const owner = req.headers.owner;
  if (owner == "0") {
    try {
      const id = await usr.findById(pk);
      if (id != null) {
        await usr
          .updateOne({ _id: id }, { $push: { emplee: req.body } })
          .then(() => {
            res.json({ status: true });
          });
      } else {
        res.json({ status: false });
      }
    } catch (err) {
      res.json({ status: false });
    }
  } else if (owner == "1") {
    try {
      const id = await usr.findOne({ "emplee._id": pk });
      if (id != null) {
        await usr
          .updateOne({ _id: id }, { $push: { emplee: req.body } })
          .then(() => {
            res.json({ status: true });
          });
      } else {
        res.json({ status: false });
      }
    } catch (err) {
      res.json({ status: false });
    }
  } else {
    res.json({ status: false });
  }
});
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
