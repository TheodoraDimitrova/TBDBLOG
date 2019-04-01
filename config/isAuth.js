module.exports = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }  else {
    req.flash("error", "You are not authorized to view that page");
    res.redirect("/users/login");
  }
 
};


