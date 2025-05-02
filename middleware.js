const Listing = require("./Models/listing.js");
const Review = require("./Models/review.js");
const ExpressError = require("./utils/ExpressErr.js");
const { listingsSchema, reviewsSchema} = require("./schema.js");

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error", "You have to login first");
        return res.redirect("/login");
    }
    console.log("isLoggedIn");
    next();
};

const saveRedirectUrl = (req, res, next) => {
    console.log("saveredirect");
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    console.log("redirect");
    next();
};

const isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "Not Authorised!");
        return res.redirect(`/listings/${id}`);
    }
    console.log("isOwner");
    next();
};

const validateListing = (req, res, next) => {
    let { error } = listingsSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        console.log("validatelist");
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewsSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        console.log("validatereview");
        next();
    }
};

const isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "Not Authorised for deleting review!");
        return res.redirect(`/listings/${id}`);
    }
    console.log("reviewAuthor");
    next();
};

const isAdmin = async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash("error", "You don't have permission to access this resource");
        return res.redirect("/listings");
    }
    console.log("isAdmin");
    next();
};

module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    validateListing,
    validateReview,
    isReviewAuthor,
    isAdmin
};