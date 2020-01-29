const axios = require('axios')

const APP_BASE_URL = require('../../app.js').APP_BASE_URL
const stores = require('../constants/stores')

exports.updatePrices = async function (req, res) {

  //Prepare search url based on store
  let url = APP_BASE_URL + '/update-list'
  let result = await getProductsList(url)

  if(result.status == 'fail'){
    console.log('Products list couldn\'t be fetched. Price update process aborted.')
    res.status(500).send({
      status: 'fail',
      statusCode: 500,
      errorMessage: 'Products list couldn\'t be fetched. Price update process aborted.'
    })
  }
  else {
    let products = result.data
    let promises = []

    //for each product retrieve price data and update product
    products.forEach(function(product) {
      promises.push(getProductInfo(product).then(result => updateProduct(result)))
    })

    //wait for all updates to finish
    Promise.all(promises)
      .then((results) => {
        let successfulUpdates = 0, failedUpdates = 0

        results.forEach(function(result) {
          if(result.status == 'success')
            successfulUpdates++
          else
            failedUpdates++
        })

        res.status(200).send({
          status: 'success',
          statusCode: 200,
          data: {successfulUpdates: successfulUpdates, failedUpdates: failedUpdates}
        })
      })
      .catch((e) => {
        console.log(e)
        res.status(500).send({
          status: 'fail',
          statusCode: 500,
          errorMessage: 'Price update process couldn\'t be executed'
        })
      })
  }
}

async function getProductsList(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Price update process error ->\n' + error.response.data)
    return error.response.data
  })
}

function getProductInfo(product) {

  url = APP_BASE_URL + '/search-product?productId=' + product.storeSpecificProductId + '&store=' + product.store

  return axios.get(url)
  .then((res) => {
    let newInfo = res.data.data
    product.currentPrice = newInfo.currentPrice
    product.lowestPrice = (product.lowestPrice < newInfo.currentPrice) ? product.lowestPrice : newInfo.currentPrice
    product.active = true

    let _30DaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0)
    let _7DaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0)
    let prev7DaysPrices = []
    let prev30DaysPrices = []

    product.priceHistory.forEach(function(priceData){
      if(new Date(priceData.date).getTime() > _30DaysAgo)
        prev30DaysPrices.push(priceData.price * 1)
      if(new Date(priceData.date).getTime() > _7DaysAgo)
        prev7DaysPrices.push(priceData.price * 1)
    })

    product.previous7DaysAverage = (prev7DaysPrices.reduce( ( x, y ) => x + y, 0 ) / prev7DaysPrices.length).toFixed(2) * 1
    product.previous30DaysAverage = (prev30DaysPrices.reduce( ( x, y ) => x + y, 0 ) / prev30DaysPrices.length).toFixed(2) * 1

    return product
  })
  .catch((error) => {
    console.log('Price update process error ->\n' + JSON.stringify(error.response.data))
    product.active = false
    return product
  })
}

function updateProduct(product) {

  delete product.priceHistory //don't send this data back, it's useless

  const url = APP_BASE_URL + '/products/' + product._id
  return axios.put(url, product)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Price update process error ->\n' + error.response.data)
    return error.response.data
  })
}
