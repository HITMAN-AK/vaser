const express = require("express");
const app = express();
const cors = require("cors");
const User = require("./user");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const password = encodeURIComponent("Ashwin01012004");
const {} = require("./user");
const user = require("./user");
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

const auth = (rq,rs,next)=>{
  console.log(`Server running on port`);
  console.log(`Server running on port`);
    next()
}
app.post("",auth,async(req,res)=>{

})

app.listen(2000, "0.0.0.0", () => {
  console.log(`Server running on port`);
});
