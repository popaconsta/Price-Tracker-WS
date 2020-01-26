const axios = require('axios')
const APP_BASE_URL = require('./app.js').APP_BASE_URL

exports.isRequestLocal = function(req, res, next) {
  if (req.hostname === 'localhost')
    return next()
  else
    res.status(401).send({
      status: 'fail',
      statusCode: 401,
      errorMessage: 'Unauthorized - service not available'
    })
}

exports.isApiKeyValid = async function(req, res, next) {
  if (req.query.apiKey == undefined)
    res.status(401).send({
      status: 'fail',
      statusCode: 401,
      message: 'Unauthorized - missing API Key'
    })
  else{
    let url = APP_BASE_URL + '/users?apiKey=' + req.query.apiKey
    let result = await getUserByApiKey(url)

    if(result.status == 'success')
      return next()
    else if(result.statusCode == 404){
      result.statusCode = 401
      res.status(401).send(result)
    }
    else
      res.status(result.statusCode).send(result)
  }
}

async function getUserByApiKey(url) {

  return axios.get(url)
  .then((res) => {
    return res.data
  })
  .catch((error) => {
    console.log(error)
    return error.response.data
  })
}
