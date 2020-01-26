const axios = require('axios')
const sort = require('fast-sort')

const APP_BASE_URL = require('../../app.js').APP_BASE_URL
const ebayAuth = require('./ebay-auth')
const ebayErrors = require('../constants/ebay-errors')
const stores = require('../constants/stores')

exports.searchEbayProduct = async function (req, res) {

  let productId = req.query.productId

  let url = 'https://api.ebay.com/buy/browse/v1/item/get_items_by_item_group?item_group_id=' + productId

  //Fetch item details from ebay
  let result = await fetchProductListing(url)

  if(result == null){
    res.status(404).send({
      status: 'fail',
      statusCode: 404,
      errorMessage: 'There is no product with this id on eBay.'
    })
    return
  }
  else if(result.items == undefined)
    result = [result] //If it's just an object, prepare an array containing it
  else
    result = result.items //If there's already an array, take it for further steps

  //Make sure the product is available and on sell
  let items = result.filter(function (item) {
    return item.price.value > 0 &&
           item.estimatedAvailabilities[0].estimatedAvailabilityStatus == 'IN_STOCK'
  })

  //Get the cheapest one
  sort(items).asc(item => item.price.value);
  let item = items[0] //ascending order so 1st element is the cheapest
  let ebayProduct = {
    storeSpecificProductId: productId,
    title: item.title,
    currentPrice: item.price.value,
    description: item.shortDescription
  }

  //console.log(ebayProduct)
  res.status(200).send({
    status: 'success',
    statusCode: 200,
    data: ebayProduct
  })

}

async function fetchProductListing(url) {

  let accessToken = await ebayAuth.getAccessToken()

  const requestHeaders = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  }

  return axios.get(url, requestHeaders)
  .then((res) => {
    //console.log('statusCode: ' + res.statusCode)
    //console.log(res.data)
    return res.data
  })
  .catch((error) => {
    error = error.response.data.errors[0]

    if(error.errorId == ebayErrors.INVALID_ACCESS_TOKEN) //acquire new token and try again
      return fetchProductListing(url)
    else if(error.errorId == ebayErrors.INVALID_ITEM_GROUP) //fallback search method
      return fetchProductListing(error.parameters[0].value)
    else if(error.errorId == ebayErrors.ITEM_GROUP_NOT_FOUND) //item not found
      return null
    else //could not contact server
      return null
  })
}
