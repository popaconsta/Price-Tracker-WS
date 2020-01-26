const mongoose = require('mongoose')
const Schema = mongoose.Schema

let PriceData = new Schema({
    date: {type: Date, required: true},
    price: {type: Number, required: true}
})

let ProductSchema = new Schema({
    storeSpecificProductId: {type: Number, required: true},
    title: {type: String, required: true, max: 200},
    currentPrice: {type: Number, required: true},
    description: {type: String, required: false, max: 500},
    lowestPrice: {type: Number, required: true},
    createdAt: {type: Date, required: true},
    store: {type: String, required: true, max: 50},
    averagePrice7Days: {type: Number, required: true},
    averagePrice30Days: {type: Number, required: true},
    priceHistory: {type: [PriceData], required: true}
})

// Export the model
module.exports = mongoose.model('Product', ProductSchema);
