const fs = require("fs")
const express = require("express")
const {
  createUser,
  loginUser,
  followUser,
  unFollowUser,
  createPost,
  isSuspended,
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
} = require("../controllers/user")
const { verifyToken, authJwt } = require("../utils/jwt")
const upload = require("../storage/multer")
const cloudinary = require("../storage/cloudinary")

const router = express.Router()
const STORAGE_NAME = "Images"
const DATA_TYPE = "image"

router.post("/users/create", async (req, res) => {
  createUser(req, res)
})

router.post("/users/login", async (req, res) => {
  loginUser(req, res)
})

router.put("/users/follow", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      followUser(authData, req, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.put("/users/unfollow", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      unFollowUser(authData, req, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

function checks(req, res, next) {
  if (isSuspended(req.params.userId)) {
    next()
  } else {
    if (req.body.images) {
      upload.array(DATA_TYPE)
    } else {
      next()
    }
  }
}

router.post("/users/posts/", verifyToken, checks, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      if (isSuspended) {
        res.status(401).json({
          status: "suspended",
          error: "Your account has been suspended",
        })
      } else {
        if (req.body.images) {
          const uploader = async (path) =>
            await cloudinary.uploads(path, STORAGE_NAME)
          const imageUrls = []
          for (const file of req.files) {
            const { path } = file
            const newPath = await uploader(path)
            imageUrls.push(newPath)
            fs.unlinkSync(path)
          }

          createPost(imageUrls, req, res)
        } else {
          const urls = []
          createPost(urls, req, res)
        }
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.get("/users/posts", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      fetchAll(res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.get("/users/posts/:postId", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      fetchOnePost(req.params.postId, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.get("/users/posts/:category", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      fetchBy(req.params.category, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.put("/users/posts/:postId/like", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      likePost(req.params.postId, req, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.put("/users/posts/:postId/unlike", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      unLikePost(req.params.postId, req, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.put("/users/posts/:postId/comment", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      commentOnPost(req.params.postId, req, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.post("/users/posts/search", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      searchForPost(req, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.put("/users/posts/:postId", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      if (isSuspended) {
        res.status(401).json({
          status: "suspended",
          error: "Your account has been suspended",
        })
      } else {
        updatePost(req.params.postId, req, res)
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.put("/users/posts/:postId/report", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      reportPost(req.params.postId, req, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.delete("/users/posts/:postId", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      if (isSuspended) {
        res.status(401).json({
          status: "suspended",
          error: "Your account has been suspended",
        })
      } else {
        deletePost(req.params.postId, res)
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

module.exports = router
