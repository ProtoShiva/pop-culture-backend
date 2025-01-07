const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "movie-logo.jpeg",
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
    savedPosts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User
