const express = require("express");
const app =express();
const cors = require("cors");
const bodyparser=require("body-parser");
const mongoose = require("mongoose");
app.use(bodyparser.json());
app.use(
    cors({
      origin: "*",
    })
);