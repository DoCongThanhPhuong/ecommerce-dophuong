'use strict'

const express = require('express')
// const { authenticationV2 } = require('~/auth/authUtils')
const { uploadDisk } = require('~/configs/multer.config')
const uploadController = require('~/controllers/upload.controller')
const asyncHandler = require('~/helpers/asyncHandler')
const router = express.Router()

// router.use(authenticationV2)
router.post('/product', asyncHandler(uploadController.uploadFile))
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadThumbnail)
)
router.post(
  '/product/multiple',
  uploadDisk.array('files', 3),
  asyncHandler(uploadController.uploadManyImagesFromLocal)
)

module.exports = router
