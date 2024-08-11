'use strict'

const { SuccessResponse } = require('~/core/success.response')
const ProductService = require('~/services/product.service.xxx')
// const ProductService = require('~/services/product.service')

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new product successfully',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update product successfully',
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId
        }
      )
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Published a product successfully',
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublished a product successfully',
      metadata: await ProductService.unpublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  /**
   * @desc get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list of drafts successfully',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list of published products successfully',
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list of searched products successfully',
      metadata: await ProductService.searchProducts(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Find products successfully',
      metadata: await ProductService.findAllProducts(req.query)
    }).send(res)
  }

  findOneProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Find one product successfully',
      metadata: await ProductService.findOneProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }
}

module.exports = new ProductController()
