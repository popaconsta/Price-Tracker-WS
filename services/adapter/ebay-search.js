const axios = require('axios')
const sort = require('fast-sort')
var base64 = require('base-64')
const qs = require('querystring')

const APP_BASE_URL = require('../../app.js').APP_BASE_URL
const ebayErrors = require('../constants/ebay-errors')
const stores = require('../constants/stores')

let token = null
let expiresAt = null

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

  if(items.length > 0){
    let item = items[0] //ascending order so 1st element is the cheapest
    let ebayProduct = {
      storeSpecificProductId: productId,
      title: item.title,
      currentPrice: item.price.value * 1,
      description: item.shortDescription
    }

    res.status(200).send({
      status: 'success',
      statusCode: 200,
      data: ebayProduct
    })
  } else {
    res.status(404).send({
      status: 'fail',
      statusCode: 404,
      errorMessage: 'This product is not on sale anymore (delisted / out of stock)'
    })
  }

}

async function fetchProductListing(url) {

  let accessToken = await getAccessToken()

  const requestHeaders = {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  }

  return axios.get(url, requestHeaders)
  .then((res) => {
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

async function getAccessToken() {

  let now = new Date().getTime()
  if(token == null || now > expiresAt)
    await refreshToken()

  return token
}

async function refreshToken() {

  const url = 'https://api.ebay.com/identity/v1/oauth2/token'

  const requestHeaders = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + base64.encode(process.env.EBAY_CLIENT_ID + ':' + process.env.EBAY_CLIENT_SECRET)
    }
  }

  const requestBody = {
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope'
  }

  return axios.post(url, qs.stringify(requestBody), requestHeaders)
  .then((res) => {
    //console.log(res.data)
    token = res.data.access_token
    expiresAt = new Date().getTime() + (res.data.expires_in * 1000) //current time in millies + expires_in in millies
  })
  .catch((error) => {
    console.error(error)
  })
}
