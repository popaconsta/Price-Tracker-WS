const axios = require('axios')
const APP_BASE_URL = require('./app.js').APP_BASE_URL

exports.isRequestLocal = function(req, res, next) {
  if (req.hostname === 'localhost')
    return next()
  else
    res.status(401).send({message: 'Unauthorized - service not available'})
}

exports.isApiKeyValid = async function(req, res, next) {
  if (req.query.apiKey == undefined)
    res.status(401).send({message: 'Unauthorized - missing api key'})
  else{
    let url = APP_BASE_URL + '/users?apiKey=' + req.query.apiKey
    let user = await getUserByApiKey(url)

    if(user != null)
      return next()
    else
      res.status(401).send({message: 'Unauthorized - invalid api key'})
  }
}

async function getUserByApiKey(url) {

  return axios.get(url)
  .then((res) => {
    return res.data.data
  })
  .catch((error) => {
    //console.log(error)
    return null
  })
}
