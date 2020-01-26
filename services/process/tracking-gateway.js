const axios = require('axios')
const stores = require('../constants/stores')
const APP_BASE_URL = require('../../app.js').APP_BASE_URL

exports.trackNewProduct = async function (req, res) {
  let store = req.query.store
  let productId = req.query.productId

  if(store == undefined || productId == undefined){
    res.status(400).send('Bad request - insufficient parameters')
    return
  }

  console.log("You requested to track " + productId + " from " + store)
  let url = APP_BASE_URL + '/create-tracking?productId=' + productId + '&store=' + store
  let trackedProduct = await createTracking(url)

  res.status(200).send(trackedProduct)
}

async function createTracking(url) {

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
