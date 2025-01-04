const Comment = require("../models/comment.model.js")
const User = require("../models/user.model.js")
const { asyncHandler } = require("../utils/tryCatch")
const ErrorHandler = require("../utils/customError")

const getPostComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 })

  if (!comments)
    return next(new ErrorHandler("Cannot find Comments. Please try again."))

  res.status(200).json(comments)
})

const addComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId

  const newComment = new Comment({
    ...req.body,
    user: req.id,
    post: postId,
  })

  const savedComment = await newComment.save()

  if (!savedComment) {
    return next(
      new ErrorHandler("Failed to post the comment. Please try again.")
    )
  }

  res.status(201).json(savedComment)
})

const deleteComment = asyncHandler(async (req, res) => {
  const id = req.params.id

  const role = "admin"

  if (role === "admin") {
    await Comment.findByIdAndDelete(id)
    return res.status(200).json("Comment has been deleted")
  }

  const user = User.findOne(req.id)

  const deletedComment = await Comment.findOneAndDelete({
    _id: id,
    user: user._id,
  })

  if (!deletedComment) {
    return res.json("You can delete only your comment!", 403)
  }

  res.status(200).json("Comment deleted")
})

module.exports = { getPostComments, addComment, deleteComment }
