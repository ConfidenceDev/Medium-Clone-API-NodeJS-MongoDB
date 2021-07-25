const mongoose = require("mongoose")

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password1: {
    type: String,
    require: true,
  },
  password2: {
    type: String,
    require: true,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
})

const Users = mongoose.model("Users", user)
module.exports = {
  user,
  Users,
}
