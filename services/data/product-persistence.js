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

exports.getProduct = function(req, res) {
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
