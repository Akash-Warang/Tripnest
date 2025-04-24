const User = require("../Models/user.js");
const { userSchema } = require("../schemas/userSchema");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        // Validate user input against schema
        const { error } = userSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',');
            req.flash("error", msg);
            return res.redirect("/signup");
        }

        const { username, email, password, firstName, lastName } = req.body;
        const newUser = new User({ 
            username, 
            email,
            firstName,
            lastName
        });

        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to TripNest! Your account has been created successfully.");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
  }

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
  }

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to tripnest");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    });
  }