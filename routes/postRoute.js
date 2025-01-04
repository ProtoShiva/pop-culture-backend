const express = require("express")
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  uploadAuth,
} = require("../controllers/postController.js")

const userAuth = require("../middleware/auth.js")

const router = express.Router()

router.get("/upload-auth", uploadAuth)

router.get("/", getPosts)
router.get("/:slug", getPost)
router.post("/", userAuth, createPost)
router.delete("/:id", userAuth, deletePost)
module.exports = router
