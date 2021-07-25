const express = require("express")
const router = express.Router()
const {
  createAdmin,
  loginAdmin,
  fetchUsers,
  fetchUserPosts,
  allReports,
  getReports,
  deletePost,
  suspendUser,
  deleteUser,
} = require("../controllers/admin")
const { verifyToken, authJwt } = require("../utils/jwt")

router.post("/admin/create", async (req, res) => {
  createAdmin(req, res)
})

router.post("/admin/login", async (req, res) => {
  loginAdmin(req, res)
})

router.get("/admin" || "/admin/", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      if (authData.isAdmin) {
        fetchUsers(res)
      } else {
        res.status(401).json({
          status: "error",
          error: "You are not an admin",
        })
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.get("/admin/:userId", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      if (authData.isAdmin) {
        fetchUserPosts(req.params.userId, res)
      } else {
        res.status(401).json({
          status: "error",
          error: "You are not an admin",
        })
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.get("/admin/reports", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      if (authData.isAdmin) {
        allReports(res)
      } else {
        res.status(401).json({
          status: "error",
          error: "You are not an admin",
        })
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.get("/admin/:userId/reports", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      if (authData.isAdmin) {
        getReports(req.params.userId, res)
      } else {
        res.status(401).json({
          status: "error",
          error: "You are not an admin",
        })
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.delete("/admin/posts/:postId", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      if (authData.isAdmin) {
        deletePost(req.params.postId, res)
      } else {
        res.status(401).json({
          status: "error",
          error: "You are not an admin",
        })
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.put("/admin/:userId/:suspended", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      if (authData.isAdmin) {
        suspendUser(req.params.userId, req.params.suspended, res)
      } else {
        res.status(401).json({
          status: "error",
          error: "You are not an admin",
        })
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.delete("/admin/:userId", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then((authData) => {
      if (authData.isAdmin) {
        deleteUser(req.params.userId, res)
      } else {
        res.status(401).json({
          status: "error",
          error: "You are not an admin",
        })
      }
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

module.exports = router
