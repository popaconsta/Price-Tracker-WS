const axios = require('axios')

const APP_BASE_URL = require('../../app.js').APP_BASE_URL
const ebaySearch = require('../adapter/ebay-search')
const bestBuySearch = require('../adapter/best-buy-search')
const stores = require('../constants/stores')

exports.searchProduct = async function (req, res) {

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

  //Prepare search url based on store
  let url = null
  if(store === stores.EBAY)
    url = APP_BASE_URL + '/ebay-search?productId=' + productId
  else if(store === stores.BEST_BUY)
    url = APP_BASE_URL + '/best-buy-search?productId=' + productId

  let result = await searchOnStore(url)
  res.status(result.statusCode).send(result) //propagate the error/product object

}

async function searchOnStore(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Product search process error ->\n' + JSON.stringify(error.response.data))
    return error.response.data
  })
}
