const Product = require('../../models/product-model')
const ObjectId = require('mongoose').Types.ObjectId

exports.test = function (req, res) {
  res.send('Greetings from the Test controller!');
}

exports.saveProduct = function (req, res) {

  let product = new Product(req.body)

  product.save(function (err) {
    if (err) {
      console.log(err)
      res.status(500).send({
        status: 'fail',
        statusCode: 500,
        errorMessage: 'Product couldn\'t be saved, please try again later'
      })
    }
    res.status(200).send({
      status: 'success',
      statusCode: 200,
      data: product
    })
  })
}

exports.getProductByTrackingId = function(req, res) {
  Product.findById(req.params.trackingId, function(err, product) {
    if (err) {
      console.log(err)
      res.status(500).send({
        status: 'fail',
        statusCode: 500,
        errorMessage: 'Tracking couldn\'t be fetched, please try again later'
      })
    }

    if(product != null)
      res.status(200).send({
        status: 'success',
        statusCode: 200,
        data: product
      })
    else
      res.status(404).send({
        status: 'fail',
        statusCode: 404,
        errorMessage: 'Tracking not found'
      })
  })
}

exports.updateProduct = function(req, res) {

  let newInfo = req.body
  //if(!newInfo.currentPrice) delete newInfo.currentPrice
  if(!newInfo.lowestPrice) delete newInfo.lowestPrice
  if(!newInfo.previous7DaysAverage) delete newInfo.previous7DaysAverage
  if(!newInfo.previous30DaysAverage) delete newInfo.previous30DaysAverage
  if(newInfo.active == undefined) delete newInfo.active
  newInfo.updatedAt = Date.now()

  let update = {}
  if(newInfo.active)
    update = {$set: newInfo, $push: {priceHistory: {date: newInfo.updatedAt, price: newInfo.currentPrice}}}
  else
    update = {$set: newInfo}

  Product.findByIdAndUpdate(req.params.trackingId, update, function(err, product) {
    if (err) {
      console.log(err)
      res.status(500).send({
        status: 'fail',
        statusCode: 500,
        errorMessage: 'Product couldn\'t be updated, please try again later'
      })
    }
    res.status(200).send({
      status: 'success',
      statusCode: 200,
      data: 'Product updated successfully'
    })
  })
}

exports.getUpdateList = function(req, res) {

  let _30DaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0)
  let today = new Date().setHours(0, 0, 0, 0)

  Product.aggregate([
    {$match : {'updatedAt': {$lt: new Date(today)}}}, //products which weren't updated today
    {$unwind: '$priceHistory'}, //flaten the price history array
    {$match : {'priceHistory.date': {$gte: new Date(_30DaysAgo)}}}, //get data no older than 30days
    {$group: { //group back the results as they were flatened earlier
      _id:'$_id',
      storeSpecificProductId: {$first: '$storeSpecificProductId'},
      lowestPrice: {$first: '$lowestPrice'},
      store: {$first: '$store'},
      priceHistory: {$push: '$priceHistory'}
    }}],
    function(err, products){
      if (err) {
        console.log(err)
        res.status(500).send({
          status: 'fail',
          statusCode: 500,
          errorMessage: 'Products summary couldn\'t be fetched, please try again later'
        })
      } else if(products != null){
        res.status(200).send({
          status: 'success',
          statusCode: 200,
          data: products
        })
      }
  })
}

exports.getProducts = function(req, res) {

  let query = {}
  if(req.query.store) query.store = req.query.store
  if(req.query.productId) query.storeSpecificProductId = req.query.productId

  Product.find(query, {_id: 1, title: 1, description: 1, currentPrice: 1}, function(err, products){
    if (err) {
      console.log(err)
      res.status(500).send({
        status: 'fail',
        statusCode: 500,
        errorMessage: 'Products query couldn\'t be executed, please try again later'
      })
    } else if(products != null){
      res.status(200).send({
        status: 'success',
        statusCode: 200,
        data: products
      })
    }
  })
}
