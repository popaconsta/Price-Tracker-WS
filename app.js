const express = require('express')
const bodyParser = require('body-parser')

const routes = require('./routes')
const app = express();

// Set up mongoose connection
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true})
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', routes)

let port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port)
});


const ebaySearch = require('./services/data/ebay-search')
ebaySearch.parseItem(133031283466)
