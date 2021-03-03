const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");

const Post = require("./models/post");

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

    Post.findById(req.params.id)
        .then(document => {
            if (document) {
                res.status(200).json({
                    message: 'OK',
                    post: document
                })
            } else {
                res.status(404).json({
                    message: 'Post not found!'
                })
            }
        })
});

module.exports = app;
