const { postData } = require("../utils/postData")
const { Users } = require("../schema/users")
const { Posts } = require("../schema/posts")
const {
  signup,
  suspended,
  fetch,
  fetchAt,
  fetchByCategory,
  create,
  like,
  unLike,
  comment,
  update,
  report,
} = require("../models/user")
const mongoose = require("mongoose")

//@desc     Create a new user
//@method   CREATE
async function createUser(req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)

    if (!obj.username || !obj.email || !obj.password1 || !obj.password2) {
      return res
        .status(301)
        .json("Some Fields are missing. Fill all Required Fields")
    }
    if (obj.password1 !== obj.password2) {
      res.status(301).json("password doesn't match")
    } else {
      await Users.findOne({ email: obj.email }).then((users) => {
        if (users) {
          return res.status(301).json("Email Already Registered. Login")
        }
      })
      signup(Users, obj)
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

//@desc     Login a new user
//@method   CREATE
async function loginUser(req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)

    await Users.findOne({ email: obj.email })
      .then((user) => {
        if (!user) {
          return res.status(302).redirect(`${process.env.API}/users/create`)
        }
        bcrypt
          .compare(obj.password, user.password1)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json("Incorrect Password!")
            } else {
              const token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.SECRET,
                { expiresIn: "200h" }
              )
              res.status(200).json({
                firstname: user.first_name,
                token: token,
              })
            }
          })
          .catch((err) => {
            res.status(500).json({
              msg: "Server Error",
              error: err,
            })
          })
      })
      .catch((err) => {
        res.status(500).json({
          msg: "Server Error",
          error: err,
        })
      })
  } catch (error) {
    console.log(error)
  }
}

//@desc     follow a user
//@method   CREATE
async function followUser(data, req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)

    Users.findByIdAndUpdate(
      obj.followId,
      {
        $push: { followers: data },
      },
      { new: true },
      (err, result) => {
        if (err) {
          res.status(422).json({
            error: err,
          })
        }
        Users.findByIdAndUpdate(
          data,
          {
            $push: { following: obj.followId },
          },
          { new: true }
        )
          .then((result) => {
            res.status(200).json(result)
          })
          .catch((err) => {
            return res.status(422).json({ error: err })
          })
      }
    )
  } catch (error) {
    console.log(error)
  }
}

//@desc     unfollow a user
//@method   CREATE
async function unFollowUser(data, req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)

    Users.findByIdAndUpdate(
      obj.followId,
      {
        $pull: { followers: data },
      },
      { new: true },
      (err, result) => {
        if (err) {
          res.status(422).json({
            error: err,
          })
        }
        Users.findByIdAndUpdate(
          data,
          {
            $pull: { following: obj.followId },
          },
          { new: true }
        )
          .then((result) => {
            res.status(200).json(result)
          })
          .catch((err) => {
            return res.status(422).json({ error: err })
          })
      }
    )
  } catch (error) {
    console.log(error)
  }
}

//@desc     Check if suspended
//@method   GET
async function isSuspended(userId) {
  try {
    const value = await suspended(Users, userId)
    return value.suspended
  } catch (error) {
    console.log(error)
  }
}

//@desc     Create a new post
//@method   CREATE
async function createPost(urls, req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)
    const newObj = { ...obj, images: urls }

    create(Posts, newObj)
      .then((result) => {
        res.status(201).json(result)
      })
      .catch((err) => {
        console.log(`Error: ${err}`)
        res.status(500).json({
          err,
          success: false,
        })
      })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Fetch posts
//@method   GET
async function fetchAll(res) {
  try {
    const items = await fetch(Posts)
    if (items) res.status(200).json(items)
    else res.status(400).json({ msg: "No post yet!" })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Fetch a posts
//@method   GET
async function fetchOnePost(postId, res) {
  try {
    const item = await fetchAt(Posts, postId)
    if (item) res.status(200).json(item)
    else res.status(400).json({ msg: "No post found!" })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Fetch by category
//@method   GET
async function fetchBy(category, res) {
  try {
    const items = await fetchByCategory(Posts, category)
    if (items) res.status(200).json(items)
    else res.status(400).json({ msg: "No posts in this category!" })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Like post
//@method   UPDATE
async function likePost(postId, req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)
    like(Posts, postId, obj)
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((err) => {
        res.status(422).json({ error: err })
      })
  } catch (error) {
    console.log(error)
  }
}

//@desc     unlike a post
//@method   UPDATE
async function unLikePost(postId, req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)
    unLike(Posts, postId, obj)
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((err) => {
        res.status(422).json({ error: err })
      })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Posting a comment
//@method   UPDATE
async function commentOnPost(postId, req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)
    comment(Posts, postId, obj)
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((err) => {
        res.status(422).json({ error: err })
      })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Search for post
//@method   CREATE
async function searchForPost(req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)

    await Posts.find({ title: obj })
      .then((result) => {
        res.status(200).json({ result })
      })
      .catch((err) => {
        console.log(err)
        res.status(401).json({
          msg: "Error: Not found!",
          success: false,
        })
      })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Update a post
//@method   UPDATE
async function updatePost(postId, req, res) {
  try {
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ msg: "Post does not exist!" })
    } else {
      const body = await postData(req)
      const obj = JSON.parse(body)
      const item = await update(postId, obj, Posts)

      if (item) {
        console.log("Post updated!")
        res.status(200).json(item)
      } else {
        res.status(500).json({
          msg: "Error: something went wrong!",
          success: false,
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

//@desc     Report a post
//@method   UPDATE
async function reportPost(postId, req, res) {
  try {
    const body = await postData(req)
    const obj = JSON.parse(body)
    report(Posts, postId, obj)
      .then((result) => {
        res.status(200).json(result)
      })
      .catch((err) => {
        res.status(422).json({ error: err })
      })
  } catch (error) {
    console.log(error)
  }
}

//@desc     Delete post
//@method   DELETE
async function deletePost(postId, res) {
  try {
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ msg: "Post does not exist!" })
    } else {
      const query = { _id: postId }
      Posts.deleteOne(query, (err, data) => {
        if (err) {
          console.log(err)
          res.status(401).json({ msg: "User not found" })
        }
        res.status(200).json({ msg: "Post removed", data })
      })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createUser,
  loginUser,
  followUser,
  unFollowUser,
  isSuspended,
  createPost,
  fetchAll,
  fetchOnePost,
  fetchBy,
  likePost,
  unLikePost,
  commentOnPost,
  searchForPost,
  updatePost,
  reportPost,
  deletePost,
}
