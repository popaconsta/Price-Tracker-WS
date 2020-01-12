const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGOLAB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("sample_weatherdata").collection("data");
  // perform actions on the collection object
  console.log(collection)
  client.close();
});
