'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const {
  newRole,
  listRoles,
  newResource,
  listResources
} = require('~/controllers/rbac.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

// router.use(authenticationV2)
router.post('/role', asyncHandler(newRole))
router.get('/roles', asyncHandler(listRoles))
router.post('/resource', asyncHandler(newResource))
router.get('/resources', asyncHandler(listResources))

module.exports = router
