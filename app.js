const express = require('express')
const bodyParser = require('body-parser')

let port = process.env.PORT || 3000

module.exports = {
  APP_BASE_URL: 'http://localhost:' + port
}

// Set up mongoose connection
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false})
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const routes = require('./routes')
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', routes)

app.listen(port, () => {
  console.log('Server is up and running on port number ' + port)
})

const priceUpdateScheduler = require('./price-update-scheduler')
priceUpdateScheduler.start()
