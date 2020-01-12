const axios = require('axios')
var base64 = require('base-64')
const qs = require('querystring')

exports.refreshToken = function () {

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

  axios.post(url, qs.stringify(requestBody), requestHeaders)
  .then((res) => {
    //console.log('statusCode: ' + res.statusCode)
    console.log(res.data)
  })
  .catch((error) => {
    console.error(error)
  })
};
