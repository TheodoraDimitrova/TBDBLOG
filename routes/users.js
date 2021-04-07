const express = require("express");
const router = express.Router();
const passport = require("passport");
const isAuth = require("../config/isAuth");

const User = require("../models/User");
const Article = require("../models/Article");
const Question = require("../models/Question");


router.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash() });
});

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  req.checkBody("email", "Email field is required").isEmail();
  req.checkBody("password", "Password field is required").notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    res.render("login", {
      errors: errors
    });
   
  } else {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true
    })(req, res, next);
  }
});

router.get("/register", (req, res, next) => {
  res.render("register", { message: req.flash() });
});
router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/users/login");
});

router.post("/register", (req, res, next) => {
  const name = req.body.name;
  const last = req.body.last;
  const email = req.body.email;
  const email_confirm = req.body.email_confirm;
  const password = req.body.password;
  const password_confirm = req.body.password_confirm;
  

  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("last", "Last Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").isEmail();
  req.checkBody("email_confirm", "Emails are not matching").equals(req.body.email);
  req.checkBody("password", "Password field is required").notEmpty();
  // req.check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long").matches("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/", "i");
  req.checkBody("password_confirm", "Please confirm your password").equals(req.body.password);

  let errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    const newUser = new User({
      name: name,
      last: last,
      email: email,
      password: password
    });

    User.registerUser(newUser, (err, user) => {
      if (err) throw err;
      req.flash("success", "You are registered and you can login");
      res.redirect("/users/login");
    });
  }
});

router.get("/profile", isAuth, (req, res, next) => {
  Question.find({author: { $eq: req.user._id }},(err,questions)=>{
    if (err) {
      console.log(err);
    }
    res.render("profile",{user:req.user});
  })
 
});

router.get("/comment/delete/:id/:post_id", isAuth, (req, res, next) => {
  Article.getArticleById(req.params.post_id, (err, article) => {
    if (err) {
      console.log(err);
    }
    if (
      article.comments.filter(
        comment => comment._id.toString() === req.params.id
      ).length === 0
    ) {
      req.flash("error", "Comment doesn't exist");
      res.redirect("/articles/show/" + req.params.post_id);
    }
    const removeIndex = article.comments
      .map(item => item._id.toString())
      .indexOf(req.params.id);
    article.comments.splice(removeIndex, 1);
    article.save().then(post => {
      req.flash("success", "You delete comment successfully");
      res.redirect("/articles/show/" + req.params.post_id);
    });
  });
});

module.exports = router;
