const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment
