module.exports = (req, res, next)=> {
    if (req.user && req.user.role === "Admin"){
      return next();
    }
    else{
      req.flash("error", "You are not admin to view that page");
      res.redirect("/");
    } 
  };