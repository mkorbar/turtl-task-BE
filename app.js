const express = require("express");

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
