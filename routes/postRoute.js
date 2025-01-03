const express = require("express")
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
} = require("../controllers/postController.js")

const userAuth = require("../middleware/auth.js")

const router = express.Router()

router.get("/", getPosts)
router.get("/:slug", getPost)
router.post("/", userAuth, createPost)
router.delete("/:id", userAuth, deletePost)
module.exports = router
