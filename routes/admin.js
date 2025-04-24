const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const adminController = require("../controllers/admin.js");

router.get("/dashboard", isLoggedIn, isAdmin, wrapAsync(adminController.renderAdminDashboard));
router.get("/users", isLoggedIn, isAdmin, wrapAsync(adminController.getAllUsers));
router.get("/listings", isLoggedIn, isAdmin, wrapAsync(adminController.getAllListings));
router.get("/pending-listings", isLoggedIn, isAdmin, wrapAsync(adminController.getPendingListings));

router.patch("/users/:id/toggle-admin", isLoggedIn, isAdmin, wrapAsync(adminController.toggleUserAdmin));
router.delete("/listings/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteListing));
router.delete("/users/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteUser));

router.post("/listings/:id/verify", isLoggedIn, isAdmin, wrapAsync(adminController.verifyListing));

module.exports = router;