const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

//signup - both /signup and /users/signup will work
router.route("/signup")
.get(userController.renderSignupForm)
.post(
  wrapAsync(userController.signup)
);

//login - both /login and /users/login will work
router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

//logout
router.get("/logout", userController.logout);

// User Dashboard
router.get("/dashboard", isLoggedIn, wrapAsync(userController.renderDashboard));
router.route("/profile")
  .get(isLoggedIn, wrapAsync(userController.renderProfile))
  .post(isLoggedIn, wrapAsync(userController.updateProfile));

// Owner Dashboard
router.get("/admin/owner-dashboard", isLoggedIn, (req, res, next) => {
  if (!req.user.isAdmin && !req.user.adminLevel > 0) {
    req.flash("error", "Access denied. Owner privileges required.");
    return res.redirect("/listings");
  }
  next();
}, wrapAsync(userController.renderOwnerDashboard));



module.exports = router;
