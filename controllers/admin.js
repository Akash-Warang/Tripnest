const User = require("../Models/user.js");
const Listing = require("../Models/listing.js");
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Email sending function
async function sendVerificationEmail(listing, status, message = '') {
    const { approvalTemplate, rejectionTemplate } = require('../utils/emailTemplates');
    
    const emailSubject = status === 'approved' ? 'Your Listing Has Been Approved!' : 'Your Listing Needs Review';
    const emailContent = status === 'approved' 
        ? approvalTemplate(listing)
        : rejectionTemplate(listing, message);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: listing.owner.email,
        subject: emailSubject,
        text: emailContent
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

module.exports.renderAdminDashboard = async (req, res) => {
    console.log("in admin 1");//.........................................

    const users = await User.find({});
    const listings = await Listing.find({}).populate('owner');
    res.render("admin/dashboard.ejs", { users, listings });
};

module.exports.getAllUsers = async (req, res) => {
    console.log("in admin 2");//.........................................

    const users = await User.find({});
    res.render("admin/users.ejs", { users });
};

module.exports.getAllListings = async (req, res) => {
    console.log("in admin 3");//.........................................

    const listings = await Listing.find({}).populate('owner');
    res.render("admin/listings.ejs", { listings });
};

module.exports.getPendingListings = async (req, res) => {
    console.log("in admin 4");//.........................................

    const listings = await Listing.find({ verificationStatus: 'pending' }).populate('owner');
    res.render("admin/pending-listings.ejs", { listings });
};

module.exports.verifyListing = async (req, res) => {
    console.log("in admin 5");//.........................................

    try {
        const { id } = req.params;
        const { action, message } = req.body;
        const listing = await Listing.findById(id).populate('owner');

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/admin/pending-listings");
        }

        listing.verificationStatus = action === 'approve' ? 'approved' : 'rejected';
        if (action === 'reject') {
            listing.verificationMessage = message;
        }

        await listing.save();
        await sendVerificationEmail(listing, listing.verificationStatus, message);

        req.flash("success", `Listing ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        res.redirect("/admin/pending-listings");
    } catch (error) {
        console.error('Error in verifyListing:', error);
        req.flash("error", "Error processing verification request");
        res.redirect("/admin/pending-listings");
    }
}

module.exports.toggleUserAdmin = async (req, res) => {
    console.log("in admin 5");//.........................................

    const { id } = req.params;
    const user = await User.findById(id);
    user.isAdmin = !user.isAdmin;
    await user.save();
    req.flash("success", `User admin status updated successfully`);
    res.redirect("/admin/users");
};

module.exports.deleteListing = async (req, res) => {
    console.log("in admin 6");//.........................................

    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/admin/listings");
};

module.exports.deleteUser = async (req, res) => {
    console.log("in admin 6");//.........................................

    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash("success", "User deleted successfully");
    res.redirect("/admin/users");
};