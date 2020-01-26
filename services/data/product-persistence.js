const Product = require('../../models/product-model');

exports.test = function (req, res) {
  res.send('Greetings from the Test controller!');
}

exports.saveProduct = function (req, res) {

  let product = new Product(req.body)

  product.save(function (err) {
    if (err) {
      console.log(err)
      res.status(500).send({message: 'Product couldn\'t be saved'})
    }
    res.status(200).send(product)
  })
}
