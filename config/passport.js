const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');

const User = require("../models/User");

//local strategy
module.exports = function(passport) {
passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      }, function(username, password, done) {
        User.getUserByEmail(username, (err, user) =>{
          if (err) throw err;
          if (!user) {
            return done(null, false, { message: "Wrong email address" });
          }
        
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Wrong password" });
            }
          });
        });
      }
    )
  );
  
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });
}