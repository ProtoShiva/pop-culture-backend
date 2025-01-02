const express = require("express")
const {
  registerUser,
  userLogin,
  getUserDetails,
  userLogout,
} = require("../../controllers/userController.js")
const userAuth = require("../../middleware/auth.js")

const route = express.Router()

route.post("/register", registerUser)
route.post("/login", userLogin)
route.post("/logout", userLogout)
route.get("/", userAuth, getUserDetails)

module.exports = route
