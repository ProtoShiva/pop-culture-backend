const express = require("express")
const {
  registerUser,
  userLogin,
  getUserDetails,
  userLogout,
  getUserSavedPosts,
  savePost,
  changeUserImage,
} = require("../controllers/userController.js")
const userAuth = require("../middleware/auth.js")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", userLogin)
router.post("/logout", userLogout)
router.get("/", userAuth, getUserDetails)
router.get("/saved", userAuth, getUserSavedPosts)
router.patch("/save", userAuth, savePost)
router.patch("/userImage", userAuth, changeUserImage)

module.exports = router
