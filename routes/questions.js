const express = require("express");
const router = express.Router();
const moment = require("moment");
const isAuth = require("../config/isAuth");

Category = require("../models/Category");
Question = require("../models/Question");

router.get("/", isAuth, (req, res, next) => {
  Question.getQuestions((err, questions) => {
    if (err) {
      console.log(err);
    }

    questions.forEach(question => {
      question.created_at = moment(question.created_on).format(
        "MMMM Do YYYY, h:mm:ss a"
      );
      question.date = moment(question.created_on).format("Do MMM");
    });

    res.render("questions_page", {
      title: "All Questions",
      questions: questions,
      message: req.flash()
    });
  });
});

router.get("/unanswered", isAuth, (req, res, next) => {
  Question.find({answers: { $eq: []}},(err,questions)=>{
    if (err) {
      console.log(err);
    }

    questions.forEach(question => {
      question.created_at = moment(question.created_on).format(
        "MMMM Do YYYY, h:mm:ss a"
      );
      question.date = moment(question.created_on).format("Do MMM");
    });

    res.render("questions_page", {
      title: "Questions with no answers",
      questions: questions,
      message: req.flash()
    });
  })
});
router.get("/show/:id", isAuth, (req, res, next) => {
  Question.getQuestionById(req.params.id, (err, question) => {
    if (err) {
      console.log(err);
    }
 

    question.created_at = moment(question.created_on)
      .startOf("hour")
      .fromNow();

    let answers = question.answers;
    answers.forEach(answer => {
      if (
        answer.answer_author._id.toString() == req.user._id.toString() ||
        req.user.role === "Admin"
      ) {
        
        answer.comment_isAuthor = true;
      }

       answer.comment_d=moment(answer.comment_date).format("Do MMMM YYYY")
       answer.questionId=question._id
      
    });
   
    res.render("question", { question: question, message: req.flash() });
  });
});

router.get("/create", isAuth, (req, res, next) => {
  Category.getCategories((err, categories) => {
    if (err) {
      console.log(err);
    }
    res.render("create_question", {
      title: "Ask a Question",
      categories: categories
    });
  });
});
router.post("/create", isAuth, (req, res, next) => {
  req.checkBody("title", "Title is required field").notEmpty();
  req.checkBody("category", "Category is required field").notEmpty();
  req.checkBody("description", "Content is required field").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    Category.getCategories((err, categories) => {
      if (err) {
        console.log(err);
      }
      res.render("create_question", {
        title: "Ask a Question",
        errors: errors,
        categories: categories
      });
    });
  } else {
    let question = new Question();
    question.title = req.body.title;
    question.category = req.body.category;
    question.description = req.body.description;
    question.author = req.user._id;
    Question.addQuestion(question, (err, question) => {
      if (err) {
        console.log(err);
      }
  
      req.flash("success", "Question is posted!");
      res.redirect("/questions/");
    });
  }
});

router.get("/answered", isAuth, (req, res, next) => {
  Question.find({answers: { $ne: []}},(err,questions)=>{
    if (err) {
      console.log(err);
    }

    questions.forEach(question => {
      question.created_at = moment(question.created_on).format(
        "MMMM Do YYYY, h:mm:ss a"
      );
      question.date = moment(question.created_on).format("Do MMM");
    });

    res.render("questions_page", {
      title: "Questions with answers",
      questions: questions,
      message: req.flash()
    });
  })
});
router.get("/answers/delete/:answerId/:questionId", isAuth, (req, res, next) => {
  Question.removeAnswer(req.params.answerId,req.params.questionId,(err,question)=>{
    if(err){
      console.log(err);
    }
    req.flash("success", "Answer is deleted!");
    res.redirect("/questions/show/"+req.params.questionId)
  })
});
router.get("/answers/delete/:questionId", isAuth, (req, res, next) => {
Question.removeQuestion(req.params.questionId,(err,question)=>{
  if(err){
    console.log(err);
  }
  req.flash("success", "Question is deleted!");
  res.redirect("/questions")
})
});

router.post("/comments/add:id", isAuth, (req, res, next) => {
  req.checkBody("answer", "Answer is required field").notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    req.flash("error", "Answer is required field");
    res.redirect(`/questions/show/${req.params.id}`);
  } else {
    const query = { _id: req.params.id };
    
    let answer = {
      answer_body: req.body.answer,
      answer_author: req.user._id
    };
   
    Question.addAnswer(query, answer, (err, question) => {
      if (err) {
        console.log(err);
      }
      
      res.redirect("/questions/show/" + req.params.id);
    });
  }
});

module.exports = router;
