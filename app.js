const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErr.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

const sessionOptions = {
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Database Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/tripnest";

main()
  .then(() => {
    console.log("Main Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(MONGO_URL);
}

//Routes App.js
app.get("/", (req, res) => {
  res.send("app is working");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async(req,res)=>{
//   let fakeUser = new User({
//     email : "student@123",   
//     username : "fakeuser"                                                //FakeUser 
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser); 
// })

//Routes App.js
app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

//Error Handling
// app.all("(.*)", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));  //throeing error thats why used app.use(); //not working thats why used anotherone
// });

app.use((req, res, next) => {
  if (!req.route) {
    // If no route matched
    next(new ExpressError(404, "Page Not Found!"));
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("err", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is listnenig to 8080");
});

//test listing
// app.get("/listing", async(req,res) =>{
//     try{
//         let list = await new Listing({
//             title : "new palace 2",
//             description : "Good place to visit 2",
//             image : "https://cdn.pixabay.com/photo/2023/01/22/05/51/nature-7735653_1280.jpg",
//             price : "1002",
//             location : "pune",
//             country : "india"
//         });

//         console.log(list);
//         list.save().then(()=>console.log("data saved in database"));
//     }catch(err){
//         console.log(err);
//     }
// })
