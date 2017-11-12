const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  tweet: {
    type: String,
    required: [true, "Tweet can't be empty"]
  },
  // Relacionamos modelo de Tweet con modelo de User
  user_id: {
    type: Schema.Types.ObjectId, // _id (User)
    ref: "User"
  },
  user_name: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
