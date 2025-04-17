const Listing = require("../Models/listing");

module.exports.index = async (req, res) => {
  const allList = await Listing.find({});
  res.render("./listings/index.ejs", { allList });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
    let list = new Listing(req.body.listing); //   let listing = req.body; //in form provided as listing{k:v,k:v....}
    list.owner = req.user._id;
    await list.save(); //   console.log(listing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" }})
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  }

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  }

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }
  