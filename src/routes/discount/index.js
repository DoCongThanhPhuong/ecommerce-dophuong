'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const discountController = require('~/controllers/discount.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get(
  '/discount_product_list',
  asyncHandler(discountController.getAllProductsByDiscountCode)
)

router.use(authenticationV2)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop))

module.exports = router
