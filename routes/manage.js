const express = require("express");
const router = express.Router();
const moment = require("moment");
const isAdmin = require("../config/isAdmin");

Category = require("../models/Category");
Article = require("../models/Article");
User = require("../models/User");

router.get("/articles", isAdmin, (req, res, next) => {
  Article.getArticles((err, articles) => {
    if (err) {
      res.send(err);
    }
    articles.forEach(article => {
      article.created_at = moment(article.created_on).format("MMM Do YY");
    });
    res.render("manage_articles", {
      message: req.flash(),
      title: "Manage Articles",
      articles: articles
    });
  });
});
router.get("/users", isAdmin, (req, res, next) => {
  User.getUsers((err, users) => {
    if (err) {
      res.send(err);
    }
    res.render("manage_users", {
      message: req.flash(),
      title: "Manage Users",
      users: users
    });
  });
});
router.get("/categories", isAdmin, (req, res, next) => {
  Category.getCategories((err, categories) => {
    if (err) {
      res.send(err);
    }
    res.render("manage_categories", {
      message: req.flash(),
      title: "Manage Categories",
      categories: categories
    });
  });
});
router.get("/articles/add", isAdmin, (req, res, next) => {
  Category.getCategories((err, categories) => {
    if (err) {
      console.log(err);
    }
    res.render("add_article", {
      message: req.flash(),
      title: "Create article",
      categories: categories
    });
  });
});
router.get("/categories/add", isAdmin, (req, res, next) => {
  res.render("add_category", { title: "Create category" });
});
router.get("/articles/edit/:id", isAdmin, (req, res, next) => {
  Article.getArticleById(req.params.id, (err, article) => {
    if (err) {
      res.sent(err);
    }
    Category.getCategories((err, categories) => {
      res.render("edit_article", {
        title: "Edit Article",
        article: article,
        categories: categories
      });
    });
  });
});
router.get("/categories/edit/:id", isAdmin, (req, res, next) => {
  Category.getCategoryById(req.params.id, (err, category) => {
    if (err) {
      res.sent(err);
    }

    res.render("edit_category", {
      title: "Edit category",
      category: category
    });
  });
});

module.exports = router;
