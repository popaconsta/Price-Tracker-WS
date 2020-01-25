const axios = require('axios')
var base64 = require('base-64')
const qs = require('querystring')
const sort = require('fast-sort')

const Product = require('../../models/product.model');

const ebayAuth = require('./ebay-auth')
const ebayErrors = require('../constants/ebay-errors')
const stores = require('../constants/stores')

exports.parseItem = async function (itemId) {

  let url = 'https://api.ebay.com/buy/browse/v1/item/get_items_by_item_group?item_group_id=' + itemId

  let result = await findItem(url)

  if(result == null){
    //return error here
  } else if(result.items == undefined) {
    result = [result]
  } else {
    result = result.items
  }

  let items = result.filter(function (item) {
    return item.price.value > 0 &&
           item.estimatedAvailabilities[0].estimatedAvailabilityStatus == 'IN_STOCK'
    })

  sort(items).asc(item => item.price.value);

  for(let i=0; i<items.length; i++){
    let item = items[i]

    console.log(item)
  }
}

async function findItem(url) {

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

    if(error.errorId == ebayErrors.INVALID_ACCESS_TOKEN){
      return findItem(url)
    }
    else if(error.errorId == ebayErrors.INVALID_ITEM_GROUP){
      return findItem(error.parameters[0].value)
    }
    else if(error.errorId == ebayErrors.ITEM_GROUP_NOT_FOUND){
      return null
    }
  })
}
