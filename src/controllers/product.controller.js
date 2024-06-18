'use strict'

const { SuccessResponse } = require('~/core/success.response')
const ProductFactory = require('~/services/product.service')

class ProductController {
  createProduct = async (req, res) => {
    new SuccessResponse({
      message: 'Create new product successfully',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }
}

module.exports = new ProductController()
