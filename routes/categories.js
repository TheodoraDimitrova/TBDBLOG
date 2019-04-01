const express = require("express");
const router = express.Router();

const isAuth=require('../config/isAuth')

Category = require("../models/Category");

router.get("/",isAuth, (req, res, next) => {
  Category.getCategories((err, categories) => {
    if (err) {
      res.send(err);
    }

    res.render("categories", { title: "Categories", categories: categories });
  });
});
router.post("/add",isAuth, (req, res, next) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("image", "Title is required").notEmpty();
  req.checkBody("description", "Description is required").notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    res.render("add_category", {
      errors: errors,
      title: "Create Category"
    });
  } else {
    let category = new Category();
    category.title = req.body.title;
    category.description = req.body.description;
    category.image=req.body.image;
    Category.addCategory(category, (err, category) => {
      if (err) {
        res.send(err);
      }
      req.flash("success", "Category saved!");

      res.redirect("/manage/categories");
    });
  }
});

router.post("/edit/:id",isAuth, (req, res, next) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("description", "Description is required").notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    Category.getCategoryById(req.params.id, (err, category) => {
      if (err) {
        res.sent(err);
      }
      res.render("edit_category", {
        title: "Create category",
        category: category,
        errors: errors
      });
    });
  } else {
    let category = new Category();
    const query = { _id: req.params.id };
    const update = {
      title: req.body.title,
      description: req.body.description
    };

    Category.updateCategory(query, update, {}, (err, category) => {
      if (err) {
        res.send(err);
      }
      req.flash("success", "Category edited!");
      res.redirect("/manage/categories");
    });
  }
});

router.delete("/delete/:id",isAuth, (req, res, next) => {
  const query = { _id: req.params.id };
  Category.removeCategory(query, (err, category) => {
    if (err) {
      res.send(err);
    }
    res.status(200);
  });
});

module.exports = router;
