const express = require('express');
const router = express.Router();
const moment = require('moment');
const isAuth = require('../config/isAuth');

Article = require('../models/Article');
Category = require('../models/Category');

router.get('/', isAuth, (req, res, next) => {
  Article.getArticles((err, articles) => {
    if (err) {
      console.log(err);
    }
    articles.forEach(article => {
      article.created_at = moment(article.created_on).format(
        'MMMM Do YYYY, h:mm:ss a'
      );
      article.date = moment(article.created_on).format('Do MMM');
    });

    res.render('articles', { title: 'All Articles', articles: articles });
  });
});
router.get('/show/:id', isAuth, (req, res, next) => {
  Article.getArticleById(req.params.id, (err, article) => {
    if (err) {
      console.log(err);
    }

    article.created_at = moment(article.created_on)
      .startOf('day')
      .fromNow();
    let comments = article.comments;

    comments.forEach(comment => {
      if (
        comment.comment_author_id.toString() == req.user._id.toString() ||
        req.user.role === 'Admin'
      ) {
        comment.comment_isAuthor = true;
      }

      comment.comment_d = moment(comment.comment_date).format('Do MMMM YYYY');
      comment.post_id = article._id;
    });

    res.render('article', { article: article, message: req.flash() });
  });
});
router.get('/category/:category_id', isAuth, (req, res, next) => {
  Article.getCategoryArticles(req.params.category_id, (err, articles) => {
    Category.getCategoryById(req.params.category_id, (err, category) => {
      if (err) {
        console.log(err);
      }
      articles.forEach(article => {
        article.date = moment(article.created_on).format('Do MMM');
      });
      res.render('articles', {
        title: category.title + ' Articles',
        articles: articles
      });
    });
  });
});
router.post('/edit/:id', isAuth, (req, res, next) => {
  req.checkBody('title', 'Title is required field').notEmpty();
  req.checkBody('category', 'Category is required field').notEmpty();
  req.checkBody('content', 'Content is required field').notEmpty();
  req.checkBody('author', 'Author is required field').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    Category.getCategories((err, categories) => {
      if (err) {
        console.log(err);
      }
      Article.getArticleById(req.params.id, (err, article) => {
        if (err) {
          res.sent(err);
        }
        res.render('edit_article', {
          title: 'Edit Article',
          errors: errors,
          article: article,
          categories: categories
        });
      });
    });
  } else {
    let article = new Article();
    const query = { _id: req.params.id };
    const update = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      content: req.body.content,
      author: req.body.author
    };

    Article.updateArticle(query, update, {}, (err, article) => {
      if (err) {
        res.send(err);
      }
      req.flash('success', 'Article edited!');
      res.redirect('/manage/articles');
    });
  }
});
router.post('/add', isAuth, (req, res, next) => {
  req.checkBody('title', 'Title is required field').notEmpty();
  req.checkBody('category', 'Category is required field').notEmpty();
  req.checkBody('content', 'Content is required field').notEmpty();
  req.checkBody('author', 'Author is required field').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    Category.getCategories((err, categories) => {
      if (err) {
        console.log(err);
      }
      res.render('add_article', {
        title: 'Create Article',
        errors: errors,
        categories: categories
      });
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.subtitle = req.body.subtitle;
    article.category = req.body.category;
    article.content = req.body.content;
    article.author = req.body.author;
    article.category = req.body.category;
    Article.addArticle(article, (err, article) => {
      if (err) {
        res.send(err);
      }
      req.flash('success', 'Article saved!');
      res.redirect('/manage/articles');
    });
  }
});
router.delete('/delete/:id', isAuth, (req, res, next) => {
  const query = { _id: req.params.id };
  Article.removeArticle(query, (err, article) => {
    if (err) {
      res.send(err);
    }
    res.status(200);
  });
});
router.post('/comments/add:id', isAuth, (req, res, next) => {
  req.checkBody('subject', 'Subject is required field').notEmpty();
  req.checkBody('comment', 'Comment is required field').notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    Article.getArticleById(req.params.id, (err, article) => {
      if (err) {
        console.log(err);
      }

      res.render('article', { article: article, errors: errors });
    });
  } else {
    let article = new Article();
    const query = { _id: req.params.id };

    let comment = {
      comment_subject: req.body.subject,
      comment_body: req.body.comment,
      comment_author: req.user.name,
      comment_author_id: req.user._id
    };

    Article.addComment(query, comment, (err, article) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/articles/show/' + req.params.id);
    });
  }
});
module.exports = router;
