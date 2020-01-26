const User = require('../../models/user-model');

exports.getUser = function(req, res) {
  
  User.findOne({ 'apiKey': req.query.apiKey }, function(err, user) {
    if (err){
      console.log(err)
      res.status(500).send({message: 'Request couldn\'t be processed'});
    }

    if(user != null)
      res.status(200).send({
        message: "ApiKey is valid",
        data: user,
      })
    else
      res.status(404).send({message: 'User couldn\'t be found'});
  })
};
