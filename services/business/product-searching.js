const axios = require('axios')

const APP_BASE_URL = require('../../app.js').APP_BASE_URL
const ebaySearch = require('../adapter/ebay-search')
const bestBuySearch = require('../adapter/best-buy-search')
const stores = require('../constants/stores')

exports.searchProduct = async function (req, res) {

  let store = req.query.store
  let productId = req.query.productId

  //Validate params
  if(store == undefined || productId == undefined)
    res.status(400).send({message: 'Bad request - insufficient parameters'})

  if(stores.SUPPORTED_STORES.indexOf(store) < 0)
    res.status(400).send({message: 'Bad request - store not supported'})

  let url = null

  if(store === stores.EBAY)
    url = APP_BASE_URL + '/ebay-search?productId=' + productId
  else if(store === stores.BEST_BUY)
    url = APP_BASE_URL + '/best-buy-search?productId=' + productId

  console.log(APP_BASE_URL)

  let product = await searchOnStore(url)

  if(product == null)
    res.status(400).send({message: "Bad request - product doesn't exist"})
  else
    res.status(200).send(product)
}

async function searchOnStore(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    if(error.response.status == 404)
      return null
    else
      console.log(error)
  })
}
