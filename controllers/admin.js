const User = require("../Models/user.js");
const Listing = require("../Models/listing.js");

module.exports.renderAdminDashboard = async (req, res) => {
    const users = await User.find({});
    const listings = await Listing.find({}).populate('owner');
    res.render("admin/dashboard.ejs", { users, listings });
};

module.exports.getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.render("admin/users.ejs", { users });
};

module.exports.getAllListings = async (req, res) => {
    const listings = await Listing.find({}).populate('owner');
    res.render("admin/listings.ejs", { listings });
};

module.exports.toggleUserAdmin = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    user.isAdmin = !user.isAdmin;
    await user.save();
    req.flash("success", `User admin status updated successfully`);
    res.redirect("/admin/users");
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/admin/listings");
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash("success", "User deleted successfully");
    res.redirect("/admin/users");
};