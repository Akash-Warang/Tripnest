const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const User = require("../Models/user.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");

router.get("/dashboard", isLoggedIn, isAdmin, adminController.renderAdminDashboard);
router.get("/users", isLoggedIn, isAdmin, adminController.getAllUsers);
router.get("/listings", isLoggedIn, isAdmin, adminController.getAllListings);
router.post("/users/:id/toggle-admin", isLoggedIn, isAdmin, adminController.toggleUserAdmin);
router.delete("/listings/:id", isLoggedIn, isAdmin, adminController.deleteListing);
router.delete("/users/:id", isLoggedIn, isAdmin, adminController.deleteUser);

module.exports = router;