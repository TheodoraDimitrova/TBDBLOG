const express = require("express");
const router = express.Router();

Category = require("../models/Category");

router.get("/", (req, res, next) => {
  Category.getCategories((err, categories) => {
    if (err) {
     return res.send(err);
    }
    res.render("index", {
      title: "TBDBlog",
      categories: categories,
      message: req.flash()
    });
  });
});

module.exports = router;
