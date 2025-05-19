const User = require("../Models/user.js");
const Booking = require("../Models/booking.js");
const Listing = require("../Models/listing.js");
const { userSchema } = require("../schemas/userSchema");
const { profileSchema } = require("../schemas/profileSchema");
const { generateOTP, sendOTP } = require("../utils/otpUtils");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP in the session
    req.session.emailVerification = {
      email,
      otp,
      otpExpiry,
    };

    // Send OTP via email
    const sent = await sendOTP(email, otp);
    if (!sent) {
      throw new Error("Failed to send OTP");
    }

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const verification = req.session.emailVerification;

    if (!verification || verification.email !== email) {
      throw new Error("Invalid verification attempt");
    }

    if (Date.now() > new Date(verification.otpExpiry).getTime()) {
      throw new Error("OTP has expired");
    }

    if (verification.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    // Mark email as verified in session
    req.session.emailVerified = email;
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    // Validate user input against schema
    const { error } = userSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      req.flash("error", msg);
      return res.redirect("/signup");
    }

    const { username, email, password, firstName, lastName } = req.body;

    // Verify email OTP verification
    if (req.session.emailVerified !== email) {
      req.flash("error", "Please verify your email address first");
      return res.redirect("/signup");
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      req.flash("error", "Username already exists");
      return res.redirect("/signup");
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash("error", "Email already exists");
      return res.redirect("/signup");
    }

    const newUser = new User({
      username,
      email,
      firstName,
      lastName,
      isEmailVerified: true,
    });

    const registeredUser = await User.register(newUser, password);

    // Clear verification data
    delete req.session.emailVerification;
    delete req.session.emailVerified;

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        "Welcome to TripNest! Your account has been created successfully."
      );
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  console.log("in user 2"); //.........................................

  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  console.log("in user 3"); //.........................................

  req.flash("success", "Welcome back to tripnest");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  console.log("in user 4"); //.........................................

  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};

module.exports.renderDashboard = async (req, res) => {
  console.log("in user 5"); //.........................................

  try {
    const user = await User.findById(req.user._id);
    const currentDate = new Date();

    // Fetch all bookings for the user and populate listing details
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ checkIn: -1 });

    // Separate current and past bookings
    const currentBookings = bookings.filter(
      (booking) =>
        new Date(booking.checkOut) >= currentDate ||
        booking.status === "pending" ||
        booking.status === "confirmed"
    );

    const pastBookings = bookings.filter(
      (booking) =>
        new Date(booking.checkOut) < currentDate &&
        (booking.status === "completed" || booking.status === "cancelled")
    );

    res.render("users/dashboard.ejs", {
      currentUser: user,
      currentBookings,
      pastBookings,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    req.flash("error", "Error loading dashboard");
    res.redirect("/listings");
  }
};

module.exports.renderProfile = async (req, res) => {
  console.log("in user 6"); //.........................................

  try {
    const user = await User.findById(req.user._id);
    const currentDate = new Date();
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ checkIn: -1 });

    const currentBookings = bookings.filter(
      (booking) =>
        new Date(booking.checkOut) >= currentDate ||
        booking.status === "pending" ||
        booking.status === "confirmed"
    );

    const pastBookings = bookings.filter(
      (booking) =>
        new Date(booking.checkOut) < currentDate &&
        (booking.status === "completed" || booking.status === "cancelled")
    );
    res.render("users/dashboard.ejs", {
      currentUser: user,
      currentBookings,
      pastBookings,
      bookings,
    });
  } catch (err) {
    req.flash("error", "Error loading profile");
    res.redirect("/users/dashboard");
  }
};

module.exports.updateProfile = async (req, res) => {
  console.log("in user 7"); //.........................................

  try {
    const { username, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    // Validate input using profileSchema
    const { error } = profileSchema.validate({ username, email, phone });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Update user profile
    user.username = username;
    user.email = email;
    user.phone = phone;
    await user.save();

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Error updating profile" });
  }
};

module.exports.renderOwnerDashboard = async (req, res) => {
  console.log("in user 8"); //.........................................

  try {
    const owner = await User.findById(req.user._id)
      .populate("listings")
      .populate({
        path: "listings",
        populate: {
          path: "bookings",
          model: "Booking",
        },
      });

    // Calculate revenue and booking stats
    const stats = {
      totalListings: owner.listings.length,
      totalBookings: owner.listings.reduce(
        (acc, listing) => acc + listing.bookings.length,
        0
      ),
      totalRevenue: owner.listings.reduce((acc, listing) => {
        return (
          acc +
          listing.bookings.reduce((sum, booking) => {
            return booking.status === "completed"
              ? sum + booking.totalAmount
              : sum;
          }, 0)
        );
      }, 0),
    };

    res.render("admin/owner-dashboard.ejs", { owner, stats });
  } catch (err) {
    console.error("Owner dashboard error:", err);
    req.flash("error", "Error loading owner dashboard");
    res.redirect("/listings");
  }
};
