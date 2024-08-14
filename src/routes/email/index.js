'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const emailController = require('~/controllers/email.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

// router.use(authenticationV2)
router.post('/new_template', asyncHandler(emailController.newTemplate))

module.exports = router
