'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const productController = require('~/controllers/product.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProducts)
)
router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findOneProduct))

// authentication
router.use(authenticationV2)
// create
router.post('', asyncHandler(productController.createProduct))
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
