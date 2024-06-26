'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const accessController = require('~/controllers/access.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
// login
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authenticationV2)
// logout'
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post(
  '/shop/handleRefreshToken',
  asyncHandler(accessController.handleRefreshToken)
)

module.exports = router
