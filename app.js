const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErr.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

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

app.use("/listings", listings)
app.use("/listings/:id/review", reviews)

//Routes App.js
app.get("/", (req, res) => {
  res.send("app is working");
});

//Error Handling

// app.all("(.*)", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));  //throeing error thats why used app.use();
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
