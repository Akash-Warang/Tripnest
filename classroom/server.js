const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");

const sessionVar = { secret: "mysecretstring", resave: false, saveUninitialized: true }
app.use(
  session(sessionVar)
);

app.get("/register", (req,res)=>{
    let { name = "anonymous"} = req.query;
    req.session.name =name;
    // res.send("ok");
    res.redirect("/hello")
})

app.get("/hello", (req,res)=>{
    res.send(`Hello, ${req.session.name}`);
})

// app.get("/test" , (req,res) =>{
//     res.send("successful");
// })

// app.get("/sessionCount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count =1;
//     }
//     res.send(`youre requested page ${req.session.count} times`);
// })

// app.use(cookieParser("code"));

// app.get("/cookies",(req, res)=>{
//     res.cookie("greet","hello");
//     res.send("sended you some cookies");
// });

// app.get("/signedCookie", (req,res)=>{
//     res.cookie("origin", "India", {signed:true});
//     res.send("Sent signed cookie");
// });

// app.get("/verify", (req,res)=>{
//     console.dir(req.signedCookies);
//     res.send(`hello`);
// });

// app.get("/", (req,res)=>{
//     res.send("Hi, I am root");
// });

app.listen(3000, () => {
  console.log("listening on port 8080");
});
