const express = require("express");
const mongoose = require("mongoose");

const Post = require("./models/post");

const conn_string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;


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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  next();
});

app.get("/api/posts", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "OK",
        posts: fetchedPosts,
        postsCount: count,
      });
    });
});

app.get("/api/posts/:id", (req, res, next) => {
  if  (req.params.id.match(/^[0-9a-fA-F]{24}$/))  {
      return Post.findById(req.params.id).then((document) => {
        if (document) {
          res.status(200).json({
            message: "OK",
            post: document,
          });
        } else {
          res.status(404).json({
            message: "Post not found",
          });
        }
      });
  }
  res.status(400).json({
    message: "Wrong id format",
  });
});

module.exports = app;
