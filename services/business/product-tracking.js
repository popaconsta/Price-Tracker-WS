const axios = require('axios')

const APP_BASE_URL = require('../../app.js').APP_BASE_URL
const productSearch = require('./product-searching')
const stores = require('../constants/stores')

exports.createTracking = async function (req, res) {
  let store = req.query.store
  let productId = req.query.productId

  let url = APP_BASE_URL + '/search-product?productId=' + productId + '&store=' + store
  let product = await searchProduct(url)

  if(product == null)
    res.status(400).send({message: 'Bad request - product doesn\'t exist'})

  product.lowestPrice = product.currentPrice
  product.createdAt = new Date().getTime()
  product.store = store
  product.averagePrice7Days = product.currentPrice
  product.averagePrice30Days = product.currentPrice
  product.priceHistory = [{date: new Date().getTime(), price: product.currentPrice}]

  //console.log(product)
  let savedProduct = await saveProduct(product)
  res.status(200).send(savedProduct)

}

async function searchProduct(url) {

  return axios.get(url)
  .then((res) => {
    //console.log('statusCode: ' + res.statusCode)
    //console.log(res.data)
    return res.data
  })
  .catch((error) => {
    console.log(error)
    return null
  })
}

async function saveProduct(product) {

  const url = APP_BASE_URL + '/products'

  return axios.post(url, product)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.error(error)
    return error
  })
}
