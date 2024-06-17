'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const productController = require('~/controllers/product.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

// authentication
router.use(authenticationV2)
// create
router.post('', asyncHandler(productController.createProduct))

module.exports = router
