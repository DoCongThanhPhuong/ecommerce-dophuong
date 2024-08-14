'use strict'

const express = require('express')
const userController = require('~/controllers/user.controller')
// const { authenticationV2 } = require('~/auth/authUtils')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

// router.use(authenticationV2)
router.post('/new_user', asyncHandler(userController.newUser))

module.exports = router
