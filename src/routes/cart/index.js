'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const cartController = require('~/controllers/cart.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

router.use(authenticationV2)
router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))
router.get('', asyncHandler(cartController.getUserCart))

module.exports = router
