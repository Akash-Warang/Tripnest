const Listing = require("../Models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { category, minPrice, maxPrice, capacity, rating, amenities, search } = req.query;
  
  let filter = { verificationStatus: 'approved' };
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (rating) filter.rating = { $gte: Number(rating) };
  if (amenities) {
    const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
    filter.amenities = { $all: amenityArray };
  }
  if (capacity) {
    const [min, max] = capacity.split('-').map(Number);
    if (max) {
      filter.capacity = { $gte: min, $lte: max };
    } else if (capacity.includes('+')) {
      filter.capacity = { $gte: min };
    } else {
      filter.capacity = min;
    }
  }

  const allData = await Listing.find(filter).sort({ createdAt: -1 });
  res.render("./listings/index.ejs", { allData });
};

module.exports.renderNewForm = (req, res) => {
  console.log("in listing 1");//.........................................
  res.render("./listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
  console.log("in listing 2");//.........................................
  try {
    let resp = await geocodingClient
      .forwardGeocode({
        query: `${req.body.listing.location}, ${req.body.listing.country}`,
        limit: 1,
      })
      .send();

    if (!resp.body.features || !resp.body.features.length) {
      req.flash("error", "Please enter a valid location.");
      return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    if (req.body.listing.agreeToPolicy === 'on') {
      req.body.listing.agreeToPolicy = true;
    }

    let list = new Listing(req.body.listing);
    list.owner = req.user._id;
    list.image = { url, filename };
    list.geometry = {
      type: 'Point',
      coordinates: resp.body.features[0].geometry.coordinates
    };

    await list.save();
    req.flash("success", "Listing created successfully! It will be visible after admin approval.");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Error creating listing. Please try again.");
    res.redirect("/listings/new");
  }
};

module.exports.showListing = async (req, res) => {
  console.log("in listing 3");//.........................................
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  console.log("in listing 4");//.........................................
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_150,h_100,c_fill/"
  );
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  console.log("in listing 5");//.........................................
  let { id } = req.params;
  let list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.url.filename;
    list.image = { url, filename };
    await list.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  console.log("in listing 6");//.........................................
  const { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
