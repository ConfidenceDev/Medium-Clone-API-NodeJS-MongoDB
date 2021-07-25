const mongoose = require("mongoose")

const admin = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
})

const Admin = mongoose.model("Admin", admin)
module.exports = {
  admin,
  Admin,
}
