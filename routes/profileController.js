const express = require("express");
const profileController = express.Router();
const User  = require("../models/user");
const Tweet = require("../models/tweet");
const moment = require("moment"); // Moment to format dates

profileController.get("/:username", (req, res, next) => {
  let isFollowing;

  User.findOne({ username: req.params.username }, (err, user) => {
    if (!user) {
      return next(err);
    }
    if (req.session.currentUser) {
      isFollowing = req.session.currentUser.following.indexOf(user._id.toString()) > -1;
    }

    Tweet.find({ "user_name": user.username }).sort({ created_at: -1 }).exec((err, tweets) => {
      res.render("profile/show", {
        username: user.username,
        tweets: tweets,
        moment: moment,
        session: req.session.currentUser,
        button_text: isFollowing ? "Unfollow" : "Follow"
      });
    });
  });
});

profileController.use((req, res, next) => {
  req.session.currentUser ? next() : res.redirect("/login")
});

profileController.post("/:username/follow", (req, res) => {
  User.findOne({ "username": req.params.username }, (err, follow) => {
    if (err) {
      res.redirect("/profile/" + req.params.username);
      return;
    }

    User.findOne({ "username": req.session.currentUser.username }, (err, currentUser) => {
      let followingIndex = currentUser.following.indexOf(follow._id);

      if (followingIndex > -1) {
        currentUser.following.splice(followingIndex, 1)
      } else {
        currentUser.following.push(follow._id);
      }

      currentUser.save((err) => {
        req.session.currentUser = currentUser;
        res.redirect("/profile/" + req.params.username);
      });
    });
  });
});

profileController.get("/:username/timeline", (req, res) => {
  const currentUser = req.session.currentUser;
  currentUser.following.push(currentUser._id);

  Tweet.find({ user_id: { $in: currentUser.following } })
       .sort({ created_at: -1 })
       .exec((err, timeline) => {
      res.render("timeline/index", {
        username: currentUser.username,
        timeline: timeline,
        moment: moment
      });
  });
});

module.exports = profileController;
