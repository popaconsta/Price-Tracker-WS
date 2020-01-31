const express = require('express')
const router = express.Router()

const Product = require('./models/product-model')
const auth = require('./auth')

const productPersistence = require('./services/data/product-persistence')
const userPersistence = require('./services/data/user-persistence')
const ebaySearch = require('./services/adapter/ebay-search')
const bestBuySearch = require('./services/adapter/best-buy-search')
const productSearch = require('./services/business/product-search')
const productTracking = require('./services/business/product-tracking')
const priceUpdate = require('./services/business/price-update')
const trackingGateway = require('./services/process/tracking-gateway')
const priceHistoryGateway = require('./services/process/price-history-gateway')

router.get('/test', productPersistence.test)

//Data services
router.post('/products', productPersistence.saveProduct)
router.get('/products', productPersistence.getProducts)
router.get('/update-list', productPersistence.getUpdateList)
router.get('/products/:trackingId', productPersistence.getProductByTrackingId)
router.put('/products/:trackingId', productPersistence.updateProduct)
router.get('/users', userPersistence.getUser)

//Adapter Services
router.get('/ebay-search', ebaySearch.searchEbayProduct)
router.get('/best-buy-search', bestBuySearch.searchBestBuyProduct)

//Business Logic Services
router.get('/search-product', productSearch.searchProduct)
router.get('/create-tracking', productTracking.createTracking)
router.get('/update-prices', priceUpdate.updatePrices)

//Process Centric Services
router.get('/track-new-product', trackingGateway.trackNewProduct)
router.get('/show-price-history', priceHistoryGateway.showPriceHistory)
router.get('/show-all-trackings', priceHistoryGateway.showAllTrackings)

module.exports = router
