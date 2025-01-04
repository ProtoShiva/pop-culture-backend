const Post = require("../models/post.model.js")
const User = require("../models/user.model.js")
const ErrorHandler = require("../utils/customError")
const { asyncHandler } = require("../utils/tryCatch")
const ImageKit = require("imagekit")

const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find()

  if (!posts)
    return next(new ErrorHandler("Cannot find Posts. Please try again."))

  res.status(200).json({ posts })
})

const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug })

  if (!post)
    return next(new ErrorHandler("Cannot find Posts. Please try again."))
  res.status(200).json(post)
})

const createPost = asyncHandler(async (req, res, next) => {
  let slug = req.body.title.replace(/ /g, "-").toLowerCase()

  let existingPost = await Post.findOne({ slug })

  let counter = 2

  while (existingPost) {
    slug = `${slug}-${counter}`
    existingPost = await Post.findOne({ slug })
    counter++
  }

  const newPost = new Post({ user: req.id, slug, ...req.body })

  const post = await newPost.save()

  if (!post) {
    return next(
      new ErrorHandler("Failed to create the post. Please try again.")
    )
  }
  res.status(200).json(post)
})

const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req?.params

  const deletedPost = await Post.findOneAndDelete({
    id,
    user: req.id,
  })

  if (!deletedPost)
    return next(new ErrorHandler("You Can only delete your own post!", 403))

  res.status(200).json(deletePost)
})

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
})

const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters()
  res.send(result)
}

module.exports = { deletePost, uploadAuth, createPost, getPost, getPosts }
