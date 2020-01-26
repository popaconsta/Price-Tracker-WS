const mongoose = require('mongoose')
const Schema = mongoose.Schema

let UserSchema = new Schema({
    apiKey: {type: String, required: true, max: 7},
    username: {type: String, required: true, max: 30}
})

module.exports = mongoose.model('User', UserSchema);
