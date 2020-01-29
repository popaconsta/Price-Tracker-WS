const mongoose = require('mongoose')
const Schema = mongoose.Schema

let PriceData = new Schema({
    date: {type: Date, required: true},
    price: {type: Number, required: true}
})

let ProductSchema = new Schema({
    storeSpecificProductId: {type: Number, required: true},
    store: {type: String, required: true, max: 50},
    title: {type: String, required: true, max: 200},
    description: {type: String, required: false, max: 500},
    currentPrice: {type: Number, required: true},
    lowestPrice: {type: Number, required: true},
    previous7DaysAverage: {type: Number, default: null},
    previous30DaysAverage: {type: Number, default: null},
    priceHistory: {type: [PriceData], required: true},
    createdAt: {type: Date, required: true},
    createdBy: {type: String, required: false, max: 30},
    updatedAt: {type: Date, required: true},
    active: {type: Boolean, default: true}
})

// Export the model
module.exports = mongoose.model('Product', ProductSchema);
