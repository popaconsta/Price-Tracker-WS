const axios = require('axios')
const APP_BASE_URL = require('../../app.js').APP_BASE_URL

exports.showPriceHistory = async function (req, res) {
  let trackingId = req.query.trackingId

  if(trackingId == undefined){
    res.status(400).send({
      status: 'fail',
      statusCode: 400,
      errorMessage: 'Bad request - missing parameters'
    })
    return
  }

  console.log("You requested tracking information for " + trackingId)
  let url = APP_BASE_URL + '/products/' + trackingId
  let result = await getPriceHistory(url)
  res.status(result.statusCode).send(result)
}

async function getPriceHistory(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log(error)
    return error.response.data
  })
}
