'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const checkoutController = require('~/controllers/checkout.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

// router.use(authenticationV2)
router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router
