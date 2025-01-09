const express = require("express")
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  uploadAuth,
  featurePost,
  getPostsCount,
} = require("../controllers/postController.js")

const userAuth = require("../middleware/auth.js")
const increaseVisit = require("../middleware/increaseVisit.js")

const router = express.Router()

router.get("/upload-auth", uploadAuth)

router.get("/", getPosts)
router.get("/count", getPostsCount)
router.get("/:slug", increaseVisit, getPost)
router.post("/", userAuth, createPost)
router.delete("/:id", userAuth, deletePost)
router.patch("/feature", userAuth, featurePost)
module.exports = router
