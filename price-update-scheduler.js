const axios = require('axios')

const APP_BASE_URL = require('./app.js').APP_BASE_URL
const priceUpdate = require('./services/business/price-update')

exports.start = function () {

  //Prepare search url based on store
  let url = APP_BASE_URL + '/update-prices'
  executePriceUpdateProcess(url) //update prices right away
  setInterval(executePriceUpdateProcess, 60 * 1000, url) //schedule next updates
}

async function executePriceUpdateProcess(url) {
  console.log('Updating prices...')
  return axios.get(url)
  .then((res) => {
    console.log('Price update process finished succesffully.\n'
    + 'Products updated: ' + res.data.data.successfulUpdates + ' Failed: ' + res.data.data.failedUpdates)
  })
  .catch((error) => {
    //console.log(error) //just in case
    console.log(error.response.data)
  })
}
