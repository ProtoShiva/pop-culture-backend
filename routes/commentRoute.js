const express = require("express")
const {
  addComment,
  deleteComment,
  getPostComments,
} = require("../controllers/commentController.js")

const userAuth = require("../middleware/auth.js")

const router = express.Router()

router.get("/:postId", getPostComments)
router.post("/:postId", userAuth, addComment)
router.delete("/:id", userAuth, deleteComment)
module.exports = router
