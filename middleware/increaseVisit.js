const Post = require("../models/post.model.js")

const increaseVisit = async (req, res, next) => {
  const slug = req.params.slug

  await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } })

  next()
}

module.exports = increaseVisit
