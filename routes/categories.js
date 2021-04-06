const express = require("express");
const router = express.Router();

const isAuth=require('../config/isAuth')

Category = require("../models/Category");

router.get("/",isAuth, async(req, res, next) => {
  Category.getCategories((err, categories) => {
    if (err) {
      res.send(err);
    }
    // res.status(200).json(categories);
    res.render("categories", {title:"Categories", categories });
  });
});
router.post("/add",isAuth, (req, res, next) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("description", "Description is required").notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    res.render("add_category", {
      errors: errors,
      title: "Create Category"
    });
  } else {
 
    Category.addCategory(req.body, (err, category) => {
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
    // let category = new Category();
    // const query = { _id: req.params.id };
    // const update = {
    //   title: req.body.title,
    //   description: req.body.description
    // };

    Category.updateCategory(req.params.id, req.body, {}, (err, category) => {
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
    req.flash("success", "Category deleted!");
  });
});

module.exports = router;
