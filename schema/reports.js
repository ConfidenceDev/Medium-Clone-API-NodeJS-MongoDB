const mongoose = require("mongoose")

const report = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  reporterId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    default: "",
  },
})

const Report = mongoose.model("Reports", report)
module.exports = {
  report,
  Report,
}
