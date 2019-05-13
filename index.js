const express = require('express')
const app = express()
const port = process.env.PORT || 8080

//Body parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Use cors
const cors = require('cors')
app.use(cors())

//Config mongoose
const mongoose = require('mongoose')
require('./config/mongoose.config')(mongoose)

//Config secret
require('./config/jwt.config')(app)

//Route
require('./routes/user.route')(app)
require('./routes/advertisemenet.route')(app)
require('./routes/project.route')(app)

app.listen(port, () => {
  console.log('Server started')
})