const axios = require('axios')
const sort = require('fast-sort')

const APP_BASE_URL = require('../../app.js').APP_BASE_URL
const stores = require('../constants/stores')

exports.searchBestBuyProduct = async function (req, res) {

  let productId = req.query.productId
  let url = 'https://api.bestbuy.com/v1/products/' + productId + '.json?apiKey=' + process.env.BEST_BUY_API_KEY
  //Fetch item details from ebay
  let result = await fetchProductListing(url)

  if(result == null){
    res.status(404).send({
      status: 'fail',
      statusCode: 404,
      errorMessage: 'There is no product with this id on BestBuy.'
    })
    return
  }

  let bestBuyProduct = {
    storeSpecificProductId: productId,
    title: result.name,
    currentPrice: result.salePrice,
    description: result.shortDescription
  }

  res.status(200).send({
    status: 'success',
    statusCode: 200,
    data: bestBuyProduct
  })
}

async function fetchProductListing(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    if(error.response.data.error.code == 404)
      return null
    else
      console.log(error)
  })
}
