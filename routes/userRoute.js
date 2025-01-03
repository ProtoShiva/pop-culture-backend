const express = require("express")
const {
  registerUser,
  userLogin,
  getUserDetails,
  userLogout,
} = require("../controllers/userController.js")
const userAuth = require("../middleware/auth.js")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", userLogin)
router.post("/logout", userLogout)
router.get("/", userAuth, getUserDetails)

module.exports = router
