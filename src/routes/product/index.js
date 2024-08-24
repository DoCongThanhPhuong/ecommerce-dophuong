'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const productController = require('~/controllers/product.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const { readCache } = require('~/middlewares/cache.middleware')
const { validateProductQuery } = require('~/validations/product.validation')
const router = express.Router()

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProducts)
)
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findOneProduct))

router.get(
  '/sku/select_variation',
  validateProductQuery,
  readCache,
  asyncHandler(productController.findOneSku)
)
router.get('/spu/get_spu_info', asyncHandler(productController.findOneSpu))

// authentication
router.use(authenticationV2)
// create SPU
router.post('/spu/new', asyncHandler(productController.createSpu))
// create product
router.post('', asyncHandler(productController.createProduct))
// update product
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post(
  '/publish/:id',
  asyncHandler(productController.publishProductByShop)
)
router.post(
  '/unpublish/:id',
  asyncHandler(productController.unpublishProductByShop)
)

router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get(
  '/published/all',
  asyncHandler(productController.getAllPublishForShop)
)

module.exports = router
