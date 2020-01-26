const User = require('../../models/user-model');

exports.getUser = function(req, res) {

  User.findOne({ 'apiKey': req.query.apiKey }, function(err, user) {
    if (err){
      console.log(err)
      res.status(500).send({
        status: 'fail',
        statusCode: 500,
        errorMessage: 'API Key could not be verified, please try again later'
      });
    }

    if(user != null)
      res.status(200).send({
        status: "success",
        statusCode: 200,
        data: user,
      })
    else
      res.status(404).send({
        status: 'fail',
        statusCode: 404,
        errorMessage: 'Invalid API Key'
    });
  })
};
