const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErr.js");
const { listingsSchema, reviewsSchema } = require("./schema.js");
const Review = require("./Models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

const validateListing = (req, res, next) => {
  let { error } = listingsSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewsSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

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

//Index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allList = await Listing.find({});
    res.render("./listings/index.ejs", { allList });
  })
);

//Create new listing route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let list = new Listing(req.body.listing); //   let listing = req.body; //in form provided as listing{k:v,k:v....}
    await list.save(); //   console.log(listing);
    res.redirect("/listings");
  })
);

//Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
  })
);

//Edit Route || Update

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  })
);

app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
  })
);

//Review
//Post review route
app.post(
  "/listings/:id/review",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("review saved");
    res.redirect(`/listings/${req.params.id}`);
  })
);

//Delete Review Route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

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
