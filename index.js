const cookieParser = require("cookie-parser")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const { connectDb } = require("./database/db")
const userRoutes = require("./routes/userRoute.js")
const postRoutes = require("./routes/postRoute.js")
const commentRoutes = require("./routes/commentRoute.js")
const errorMiddleware = require("./middleware/errorHandler.js")

const app = express()
const PORT = 8000

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cors({ origin: true, credentials: true }))

//for image upload auth
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   )
//   next()
// })

app.get("/", (req, res) => {
  res.send("hello user")
})

app.use("/api/user", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use(errorMiddleware)

app.listen(PORT, () => console.log(`server listening at port ${PORT}`))
