const mongoose = require("mongoose")

const banish = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
})

const Banish = mongoose.model("Banish", banish)
module.exports = {
  Banish,
}
