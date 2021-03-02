const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");

const conn_string = `mongodb+srv://${config.database.user}:${config.database.password}@${config.database.host}`;

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(conn_string)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Db connection failed " + err);
  });

const app = express();

app.get("/api/posts", (req, res, next) => {
    res.status(200).json({
        message: 'OK'
    })
});

app.get("/api/posts/:id", (req, res, next) => {
    res.status(200).json({
        message: 'OK',
        postId: req.params.id
    })
});

module.exports = app;
