/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var Book = require('../models/Book');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, next){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function(err, foundBooks) {
        if(err) return next(err);
        res.json(foundBooks.map(el => el.toObject()));
      })
    })
    
    .post(function (req, res, next){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      var newBook = new Book({title});
      newBook.save(function(err, savedBook) {
        if(err) {
          console.log(err);
          if(err.name === "ValidationError" && err.errors.title.kind === "required") {
            return res.send("missing inputs");
          }
          return next(err);
        }
        res.json(savedBook.toObject());
      });
    })
    
    .delete(function(req, res, next){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function(err, deleted) {
        if(err) return next(err);
        if(deleted) {
          res.send('complete delete successful');
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res, next){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, function(err, foundBook) {
        if(!err && foundBook) {
          res.json(foundBook.toObject());
        } else {
          res.send("no book exists");
        }
      })
    })
    
    .post(function(req, res, next){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findByIdAndUpdate(bookid, { $push: { comments: comment}, $inc: { commentcount: 1} }, {new : true}, function(err, updatedBook) {
        if(err) return next(err);
        if(updatedBook) {
          res.json(updatedBook.toObject());
        }
      });
    })
    
    .delete(function(req, res, next){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, function(err, deleted) {
        if(err) return next(err);
        if (deleted) {
          res.send("delete successful");
        }
      });
    });
  
};
