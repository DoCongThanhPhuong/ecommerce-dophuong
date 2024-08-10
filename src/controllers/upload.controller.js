'use strict'

const { BadRequestError } = require('~/core/error.response')
const { SuccessResponse } = require('~/core/success.response')
const {
  uploadImageByUrl,
  uploadImageFromLocal,
  uploadManyImagesFromLocal
} = require('~/services/upload.service')

class UploadController {
  uploadFile = async (req, res) => {
    new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageByUrl()
    }).send(res)
  }

  uploadThumbnail = async (req, res) => {
    const { file } = req
    if (!file) {
      throw new BadRequestError('File missing')
    }
    new SuccessResponse({
      message: 'Upload thumbnail successfully',
      metadata: await uploadImageFromLocal({
        path: file.path
      })
    }).send(res)
  }

  uploadManyImagesFromLocal = async (req, res) => {
    const { files } = req
    if (!files.length) {
      throw new BadRequestError('Files missing')
    }
    new SuccessResponse({
      message: 'Upload files successfully',
      metadata: await uploadManyImagesFromLocal({
        files
        // ...req.body
      })
    }).send(res)
  }
}

module.exports = new UploadController()
