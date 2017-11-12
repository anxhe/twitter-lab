const express = require("express");
const tweetsController = express.Router()
const moment = require("moment"); // Libreria para manejo de fechas

const User  = require("../models/user");
const Tweet = require("../models/tweet");

tweetsController.use((req, res, next) => {
  req.session.currentUser ? next() : res.redirect("/login");
})

tweetsController.get("/", (req, res, next) => {
  User.findOne({ username: req.session.currentUser.username }, (err, user) => {
    // Para mostrar el error usando la vista de error.ejs generada por express-generator
    if (err || !user) {
      res.render('error', { message: err.message, error: err })
      return;
    }

    // Primero find, despues sort, y entonces ejecutamos el query con exec
    Tweet.find({ "user_name": user.username }).sort({ created_at: -1 }).exec((err, tweets) => {
      res.render("tweets/index", {
        username: user.username,
        tweets: tweets,
        moment: moment
      });
    });
  });
});

tweetsController.get("/new", (req, res, next) => {
  res.render("tweets/new", { username: req.session.currentUser.username });
});

tweetsController.post("/", (req, res, next) => {
  const user = req.session.currentUser;

  User.findOne({ username: user.username }, (err, user) => {
    if (err) {
      return;
    }

    const newTweet = new Tweet({
      user_id:   user._id,
      user_name: user.username,
      tweet:     req.body.tweetText
    });

    newTweet.save((err) => {
      if (err) {
        res.render("tweets/new", {
          username: user.username,
          errorMessage: err.errors.tweet.message
        });
      } else {
        res.redirect("/tweets");
      }
    });
  });
});


module.exports = tweetsController;
