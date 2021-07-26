const { postData } = require("../utils/postData")
const { create, fetch, fetchAt, reports } = require("../services/admin")
const { Admin } = require("../schema/admin")
const { Users } = require("../schema/users")
const { Post } = require("../schema/posts")
const { Report } = require("../schema/reports")
const { Banish } = require("../schema/banish")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//@desc     Create an admin
//@method   CREATE
async function createAdmin(req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)

    if (!obj.admin_id || !obj.email || !obj.password) {
      res.status(301).json("Some Fields are missing. Fill all Required Fields")
    } else {
      Admin.findOne({ email: obj.email }).then((user) => {
        if (user) {
          return res.status(301).json("Email is Already Registered. Login")
        }
      })

      create(Admin, obj)
        .then((result) => {
          res.status(200).json(result)
        })
        .catch((err) => {
          res.status(301)
          res.send(err)
        })
    }
  } catch (error) {
    console.log(error)
  }
}

//@desc     Login an admin
//@method   CREATE
async function loginAdmin(req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)

    Admin.findOne({ admin_id: obj.admin_id })
      .then((user) => {
        if (!user) {
          return res
            .status(301)
            .json(
              "You are not an Admin, Create an Admin account or Sign in as a user"
            )
        }
        bcrypt
          .compare(obj.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(301).json("Incorrect Password!")
            } else {
              const token = jwt.sign(
                { email: user.email },
                process.env.SECRET,
                {
                  expiresIn: "200h",
                }
              )
              res.status(200).json({
                admin_id: user.admin_id,
                token: token,
              })
            }
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            })
          })
      })
      .catch((error) => {
        res.status(500).json({
          error: "Error",
        })
      })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Fetch all users
//@method   GET
async function fetchUsers(res) {
  try {
    let filter = {}
    const users = await fetch(Users)
    if (users) res.status(200).json(users)
    else res.status(200).json({ msg: "No users" })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Get a user
//@method   READ
async function fetchUserPosts(userId, res) {
  try {
    const items = await fetchAt(Users, userId)
    if (items) res.status(200).json(items)
    else res.sendStatus(403)
  } catch (error) {
    console.log(error)
  }
}

//@desc     Fetch all reports on post
//@method   GET
async function allReports(res) {
  try {
    let filter = {}
    const reports = await reports(Report, filter)
    if (reports) res.status(200).json(reports)
    else res.status(200).json({ msg: "No reports" })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Fetch single report
//@method   GET
async function getReports(userId, res) {
  try {
    let filter = {
      userId: userId,
    }
    const items = await reports(Report, filter)
    if (items) res.status(200).json(items)
    else res.status(200).json({ msg: "No report found" })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Delete post
//@method   DELETE
async function deletePost(postId, res) {
  try {
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ msg: "User does not exist!" })
    } else {
      const query = { _id: postId }
      Post.deleteOne(query, (err, data) => {
        if (err) {
          console.log(err)
          res.status(401).json({ msg: "Post not found" })
        }
        res.status(200).json({ msg: "Post removed", data })
      })
    }
  } catch (error) {
    console.log(error)
  }
}

//@desc     Suspend a user
//@method   UPDATE
async function suspendUser(userId, value, res) {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ msg: "User does not exist!" })
    } else {
      const changes = { suspended: value }
      Users.findOneAndUpdate(userId, changes, {
        new: true,
        useFindAndModify: false,
      })
        .then(() => {
          res.status(200).json({ msg: "User account updated!" })
        })
        .catch((err) => {
          console.log(err)
          res.status(401).json({ msg: "Something went wrong!", err: err })
        })
    }
  } catch (error) {
    console.log(error)
  }
}

//@desc     Delete a user
//@method   DELETE
async function deleteUser(userId, res) {
  try {
    const query = { _id: userId }
    Users.deleteOne(query, (err, data) => {
      if (err) {
        console.log(err)
        res.status(401).json({ msg: "User not found" })
      }
      res.status(200).json({ msg: "User removed", data })
    })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Banish a user
//@method   DELETE
async function banishUser(userId, res) {
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ msg: "User does not exist!" })
    } else {
      const query = { _id: userId }
      Users.deleteOne(query, (err, data) => {
        if (err) {
          console.log(err)
          res.status(401).json({ msg: "User not found" })
        }

        console.log(data)
        //res.status(200).json({ msg: "User has been banished", data })

        /*await new Banish(data.email)
          .save()
          .then(() => {
            console.log("Banihed a user")
            res.status(200).json({ msg: "User has been banished" })
          })
          .catch((err) => {
            res.status(403).json({ msg: "An error occured" })
          })*/
      })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createAdmin,
  loginAdmin,
  fetchUsers,
  fetchUserPosts,
  allReports,
  getReports,
  deletePost,
  suspendUser,
  deleteUser,
  banishUser,
}
