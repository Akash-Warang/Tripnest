const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");

module.exports.createReview = async (req, res) => {
  console.log("in review 1");//.........................................
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    await listing.calculateAvgRating();

    console.log("review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${req.params.id}`);
  }

module.exports.deleteReview = async (req, res) => {
  console.log("in review 2");//.........................................
  let { id, reviewId } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  await listing.calculateAvgRating();

  req.flash("success", "New Review Deleted!");
  res.redirect(`/listings/${id}`);
}