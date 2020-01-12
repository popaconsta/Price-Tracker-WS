// const MongoClient = require('mongodb').MongoClient;
// const uri = process.env.MONGOLAB_URI;
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("sample_weatherdata").collection("data");
//   // perform actions on the collection object
//   console.log(collection)
//   client.close();
// });
//
//
// const express = require('express');
// const bodyParser = require('body-parser');
// const routes = require('./routes'); // Imports routes for the products
// const app = express();
// app.use('/', routes);
// let port = 1234;
// app.listen(port, () => {
//     console.log('Server is up and running on port numner ' + port);
// });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    console.log('Server is up and running on port numner ' + port)
});


// const ebayAuth = require('./services/data/ebay-auth')
// ebayAuth.refreshToken()

const ebaySearch = require('./services/data/ebay-search')
ebaySearch.searchItem()
