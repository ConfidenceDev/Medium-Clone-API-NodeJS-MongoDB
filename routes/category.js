const express = require("express")
const router = express.Router()
const {
  createCategory,
  fetchAllCatgories,
  fetchCategory,
} = require("../controllers/category")
const { verifyToken, authJwt } = require("../utils/jwt")

router.post("/category", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      createCategory(req, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.get("/category", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      fetchAllCatgories(res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

router.get("/category/:id", verifyToken, async (req, res) => {
  authJwt(req.token)
    .then(() => {
      fetchCategory(req.params.id, res)
    })
    .catch((err) => {
      res.status(403).json({ err })
    })
})

module.exports = router
