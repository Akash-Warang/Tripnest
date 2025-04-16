module.exports.isLoggedIn= (req, res, next) =>{
    if(!req.isAuthenticated()){
    req.flash("error", "You have to login for create new listing");
    return res.redirect("/login")
  }
  next();
}