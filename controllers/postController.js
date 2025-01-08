const Post = require("../models/post.model.js")
const User = require("../models/user.model.js")
const ErrorHandler = require("../utils/customError")
const { asyncHandler } = require("../utils/tryCatch")
const ImageKit = require("imagekit")

const getPosts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 2

  const query = {}

  const cat = req.query.cat
  const author = req.query.author
  const searchQuery = req.query.search
  const sortQuery = req.query.sort
  const featured = req.query.featured

  if (cat && cat !== "general") {
    query.category = cat
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" }
  }

  if (author) {
    const user = await User.findOne({ name: author }).select("_id")

    if (!user) {
      return next(new ErrorHandler("No Posts found. Please try again.", 404))
    }

    query.user = user._id
  }

  let sortObj = { createdAt: -1 }

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 }
        break
      case "oldest":
        sortObj = { createdAt: 1 }
        break
      case "popular":
        sortObj = { visit: -1 }
        break
      case "trending":
        sortObj = { visit: -1 }
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        }
        break
      default:
        break
    }
  }

  if (featured) {
    query.isFeatured = true
  }

  const posts = await Post.find(query)
    .populate("user", "name")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit)

  const totalPosts = await Post.countDocuments(query)

  const hasMore = page * limit < totalPosts

  if (!posts)
    return next(new ErrorHandler("Cannot find Posts. Please try again."))

  res.status(200).json({ posts, hasMore })
})

const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "name img"
  )

  if (!post)
    return next(new ErrorHandler("Cannot find Posts. Please try again.", 403))
  res.status(200).json(post)
})

const createPost = asyncHandler(async (req, res, next) => {
  let slug = req.body.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .split("-")
    .slice(0, 8)
    .join("-")

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
  res.status(201).json(post)
})

const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req?.params

  const role = "admin"

  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id)
    return res.status(200).json("Post has been deleted")
  }

  const deletedPost = await Post.findOneAndDelete({
    id,
    user: req.id,
  })

  if (!deletedPost)
    return next(new ErrorHandler("You Can only delete your own post!", 403))

  res.status(200).json(deletePost)
})

const featurePost = asyncHandler(async (req, res, next) => {
  const postId = req.body.postId

  const role = "admin"

  if (role !== "admin") {
    return res.status(403).json("You cannot feature posts!")
  }

  const post = await Post.findById(postId)

  if (!post) {
    return next(new ErrorHandler("Cannot find Posts. Please try again.", 403))
  }

  const isFeatured = post.isFeatured

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true }
  )

  res.status(200).json(updatedPost)
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

module.exports = {
  deletePost,
  uploadAuth,
  createPost,
  getPost,
  getPosts,
  featurePost,
}
