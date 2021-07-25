const path = require("path")
const express = require("express")
const { connect } = require("./db")
const cors = require("cors")
require("dotenv").config()

const admin = require("./routes/admin")
const user = require("./routes/user")
const category = require("./routes/category")
const app = express()

const PORT = process.env.PORT || 4000
app.use(cors())

connect()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(`${process.env.API}`, admin)
app.use(`${process.env.API}`, user)
app.use(`${process.env.API}`, category)

app.get("/", (req, res) => {
  res.render("index.html")
})

app.listen(PORT, () => console.log(`Server runing on port: ${PORT}`))
