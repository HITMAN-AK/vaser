const express = require("express");
const app =express();
const cors = require("cors");
const bodyparser=require("body-parser");
const mongoose = require("mongoose");
const password = encodeURIComponent("Ashwin@01012004");
const {} = require("./user")
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
      `mongodb+srv://legendaryairforce:${password}@mrdb.expdex1.mongodb.net/mrdb`
    )
    .then(() => {
      console.log("db connect success");
    })
    .catch((err) => {
      console.log("db connect error", err);
    });
}
app.listen(2000, "0.0.0.0", () => {
  console.log(`Server running on port`);
});
