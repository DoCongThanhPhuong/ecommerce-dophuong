'use strict'

const express = require('express')
const { authenticationV2 } = require('~/auth/authUtils')
const commentController = require('~/controllers/comment.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

router.use(authenticationV2)
router.post('', asyncHandler(commentController.createComment))
router.get('', asyncHandler(commentController.getCommentsByParentId))
router.delete('', asyncHandler(commentController.deleteComment))
module.exports = router
