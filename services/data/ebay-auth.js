const axios = require('axios')
var base64 = require('base-64')
const qs = require('querystring')

let token = null
let expiresAt = null

exports.getAccessToken = async function () {

  let now = new Date().getTime()
  if(token == null || now > expiresAt)
    await refreshToken()

  return token

};

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
