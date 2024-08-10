'use strict'

const cloudinary = require('~/configs/cloudinary.config')

// 1. upload image by url
const uploadImageByUrl = async () => {
  try {
    const imageUrl =
      'https://th.bing.com/th/id/OIP.2fUwSstJ-3W8XJ_rUEfdhQHaHa?pid=ImgDet&w=182&h=182&c=7'
    const folderName = 'product/shop',
      newFileName = 'demo'
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: newFileName,
      folder: folderName
    })
    // console.log('🚀 ~ uploadImageByUrl ~ result:', result)
    return result
  } catch (error) {
    console.error('🚀 ~ uploadImageByUrl ~ error:', error)
  }
}

const uploadImageFromLocal = async ({ path, folderName = 'product/shop' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumbnail',
      folder: folderName
    })
    return {
      image_url: result.secure_url,
      shopId: '2308',
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg',
        crop: 'fill'
      })
    }
  } catch (error) {
    console.error('🚀 ~ uploadImageFromLocal ~ error:', error)
  }
}

const uploadManyImagesFromLocal = async ({
  files,
  folderName = 'product/shop'
}) => {
  try {
    if (!files.length) return

    const uploadedUrls = []
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName
      })

      uploadedUrls.push({
        image_url: result.secure_url,
        shopId: '2308',
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg',
          crop: 'fill'
        })
      })
    }

    return uploadedUrls
  } catch (error) {
    console.error('🚀 ~ uploadImageFromLocal ~ error:', error)
  }
}

module.exports = {
  uploadImageByUrl,
  uploadImageFromLocal,
  uploadManyImagesFromLocal
}
