const mongoose = require("mongoose")

const post = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  comment: [
    {
      text: String,
      postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    },
  ],
  videoUrls: {
    type: [String],
    required: false,
  },
  images: {
    type: [String],
    required: false,
  },
  createdon: {
    type: Date,
    default: Date.now(),
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  post_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  reports: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reports",
    required: false,
  },
})

const Posts = mongoose.model("Posts", post)
module.exports = {
  post,
  Posts,
}
