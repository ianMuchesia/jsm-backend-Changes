const express = require('express')

const router = express.Router()


const { createProduct, getAllProducts, getSingleProduct } = require('../controllers/productController')


router.post('/', createProduct)
router.get('/', getAllProducts)
router.get('/:productID', getSingleProduct)


module.exports = router