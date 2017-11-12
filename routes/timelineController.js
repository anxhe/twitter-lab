// routes/timelineController.js
const express = require("express");
const timelineController = express.Router();
const Tweet = require("../models/tweet"); // Models
const moment = require("moment"); // Moment to format dates

timelineController.get("/", (req, res) => {
  Tweet.find({}, "user_name tweet created_at").sort({ created_at: -1 }).exec((err, timeline) => {
      res.render("timeline/index", { timeline: timeline, moment: moment });
  });
});


module.exports = timelineController;
