const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  description: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_on: { type: Date, default: Date.now },
  answers: [
    {
      answer_body: { type: String, required: true, trim: true },
      answer_author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      comment_date: { type: Date, default: Date.now }
    }
  ]
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

module.exports.getQuestions = function(callback, limit) {
  Question.find(callback)
    .populate("author")
    .populate("category")
    .limit(limit)
    .sort([["title", "ascending"]]);
};
module.exports.addQuestion = function(question, callback) {
  Question.create(question, callback);
};
module.exports.getQuestionById = function(id, callback) {
  Question.findById(id, callback)
    .populate("author")
    .populate("category")
    .populate("answers.answer_author");
};
module.exports.addAnswer = function(query, answer, callback) {
  Question.updateOne(
    query,
    {
      $push: {
        answers: answer
      }
    },
    callback
  );
};
module.exports.removeAnswer = function(answerId, questionId, callback) {
  Question.findByIdAndUpdate(
    questionId,
    { $pull: { answers: { _id: answerId } } },
    callback
  );
};
module.exports.removeQuestion = function(questionId, callback) {
  Question.findByIdAndRemove(questionId, callback);
};
