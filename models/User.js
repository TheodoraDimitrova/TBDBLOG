var mongoose = require('mongoose')
const bcrypt = require("bcryptjs"); //windows

//Create Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  last: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  role: { type: String, enum: ["User", "Admin"], default: "User" },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

module.exports.registerUser = function(newUser, callback) {

  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }
    console.log(hash);
    newUser.password = hash;
    newUser.save(callback);
  });
};
module.exports.getUserByEmail = function(email, callback) {
  const query = { email: email };
  User.findOne(query, callback);
};
module.exports.getUserById = function(id, callback) {
  const query = { _id: id };

  User.findById(query, callback);
};
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, res) {
    if (res) {
      console.log(res);
      callback(null, res);
    } else {
      console.log(err);
    }
  });
};
module.exports.getUsers = function(callback, limit) {
  User.find(callback)
    .limit(limit)
    .sort([["name", "ascending"]]);
};


