const axios = require('axios')

const APP_BASE_URL = require('../../app.js').APP_BASE_URL
const productSearch = require('./product-searching')
const stores = require('../constants/stores')

exports.createTracking = async function (req, res) {
  let store = req.query.store
  let productId = req.query.productId

  //Validate params
  if(store == undefined || productId == undefined){
    res.status(400).send({
      status: 'fail',
      statusCode: 400,
      errorMessage: 'Bad request - missing parameters'
    })
    return //force method to finish
  }

  if(stores.SUPPORTED_STORES.indexOf(store) < 0){
    res.status(400).send({
      status: 'fail',
      statusCode: 400,
      message: 'Bad request - store not supported'
    })
    return //force method to finish
  }

  let url = APP_BASE_URL + '/search-product?productId=' + productId + '&store=' + store
  let result = await searchProduct(url)
  if(result.status == 'fail'){
    if(result.statusCode == 404)
      result.statusCode = 400

    res.status(400).send(result)
    return
  }

  let product = result.data
  product.lowestPrice = product.currentPrice
  product.createdAt = new Date().getTime()
  product.store = store
  product.averagePrice7Days = product.currentPrice
  product.averagePrice30Days = product.currentPrice
  product.priceHistory = [{date: new Date().getTime(), price: product.currentPrice}]

  //console.log(product)
  result = await saveProduct(product)
  if(result.status == 'success')
    res.status(200).send({
      status: 'success',
      statusCode: 200,
      trackingId: result.data._id
    })
  else
    res.status(result.statusCode).send(result)

}

async function searchProduct(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log(error)
    return error.response.data
  })
}

async function saveProduct(product) {

  const url = APP_BASE_URL + '/products'

  return axios.post(url, product)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log(error)
    return error.response.data
  })
}
