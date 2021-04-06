const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String ,required: true, trim: true },
  subtitle: { type: String ,required: true, trim: true},
  category: { type: String ,required: true, trim: true},
  content: { type: String ,required: true, trim: true},
  author: { type: String,required: true, trim: true },
  created_on: { type: Date, default: Date.now },
  comments:[{
      comment_subject:{ type: String,required: true, trim: true},
      comment_body:{type:String,required: true, trim: true},
      comment_author:{type:String,required: true, trim: true},
      comment_isAuthor:{type:Boolean,default:false},
      comment_author_id:{type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
      comment_date:{ type: Date , default:Date.now}
  }]
});

const Article=mongoose.model("Article",articleSchema);
module.exports=Article;


module.exports.getArticles = function(callback, limit) {
    Article.find(callback)
      .limit(limit)
      .sort([["title", "ascending"]]);
  };
  module.exports.getCategoryArticles=function(categoryId,callback){
    let query={category:categoryId}
    Article.find(query,callback).sort([["title","ascending"]])
  }
  
  module.exports.addArticle = function(article, callback) {
    Article.create(article, callback);
  };
  module.exports.getArticleById = function(id, callback) {
    Article.findById(id, callback);
  };
  module.exports.updateArticle = function(query, update, options, callback) {
    Article.findOneAndUpdate(query, update, options, callback);
  };
  module.exports.removeArticle = function(query, callback) {
    Article.deleteOne(query, callback);
  };
  module.exports.addComment=function(query,comment,callback){
    Article.updateOne(query,{
      $push: {
        comments:comment
      }
    },callback)
  }
 
  