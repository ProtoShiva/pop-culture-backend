const jwt = require("jsonwebtoken")
const ErrorHandler = require("../utils/customError.js")

const userAuth = async (req, res, next) => {
  const token = req?.cookies.token

  try {
    if (!token) {
      return next(new ErrorHandler("You are not authenticated", 401))
    }

    const user = jwt.verify(token, process.env.APP_JWT_SECRET_KEY)

    req.id = user.id
  } catch (error) {
    next(error)
  }

  next()
}

module.exports = userAuth
