const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const { listingsSchema} = require("../schema.js");
const Listing = require("../Models/listing.js");

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

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allList = await Listing.find({});
    res.render("./listings/index.ejs", { allList });
  })
);

//Create new listing route
router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let list = new Listing(req.body.listing); //   let listing = req.body; //in form provided as listing{k:v,k:v....}
    await list.save(); //   console.log(listing);
    res.redirect("/listings");
  })
);

//Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
  })
);

//Edit Route || Update

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
  })
);


module.exports = router;