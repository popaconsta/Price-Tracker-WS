const axios = require('axios')
const stores = require('../constants/stores')
const APP_BASE_URL = require('../../app.js').APP_BASE_URL

exports.trackNewProduct = async function (req, res) {
  let store = req.query.store
  let productId = req.query.productId

  if(store == undefined || productId == undefined){
    res.status(400).send({
      status: 'fail',
      statusCode: 400,
      errorMessage: 'Bad request - missing parameters'
    })
    return
  }

  console.log("You requested to track " + productId + " from " + store)
  let url = APP_BASE_URL + '/create-tracking?productId=' + productId + '&store=' + store
  let result = await createTracking(url)
  res.status(result.statusCode).send(result)
}

async function createTracking(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log('Product tracking gateway error ->\n' + JSON.stringify(error.response.data))
    return error.response.data
  })
}
