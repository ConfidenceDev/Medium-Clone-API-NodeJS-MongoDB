const mongoose = require("mongoose")

const category = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
})

const Category = mongoose.model("Category", category)
module.exports = {
  category,
  Category,
}
