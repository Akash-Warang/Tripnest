const express = require("express");
const app = express();
const users = require ("./routes/user.js");
const users = require ("./routes/post.js");

app.get("/", (req,res)=>{
    res.send("Hi, I am root");
});

app.listen(8080 , ()=>{
    console.log("listening on port 8080");
});
