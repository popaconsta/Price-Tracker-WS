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

  let result = await getDuplicatedProduct(store, productId)

  if(result.status == 'fail') {
    res.status(result.statusCode).send(result)
    return
  }

  if(result.data.length > 0) {
    res.status(400).send({
      status: 'fail',
      statusCode: 400,
      errorMessage: 'There is already an existing tracking for this product (' + result.data[0]._id + ')'
    })
    return
  }

  let url = APP_BASE_URL + '/search-product?productId=' + productId + '&store=' + store
  result = await getStoreProductInfo(url)
  if(result.status == 'fail'){
    if(result.statusCode == 404)
      result.statusCode = 400

    res.status(400).send(result)
    return
  }

  let product = result.data
  product.createdAt = new Date().getTime()
  product.updatedAt = product.createdAt
  product.lowestPrice = product.currentPrice
  product.priceHistory = [{date: Date.now(), price: product.currentPrice}]
  product.store = store

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

function getDuplicatedProduct(store, productId) {

  let url = APP_BASE_URL + '/products?store=' + store + '&productId=' + productId

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Product tracking process error ->\n' + JSON.stringify(error.response.data))
    return error.response.data
  })
}


function getStoreProductInfo(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Product tracking process error ->\n' + JSON.stringify(error.response.data))
    return error.response.data
  })
}

function saveProduct(product) {

  const url = APP_BASE_URL + '/products'

  return axios.post(url, product)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Product tracking process error ->\n' + JSON.stringify(error.response.data))
    return error.response.data
  })
}
