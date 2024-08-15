'use strict'

const { SuccessResponse } = require('~/core/success.response')
const ProductService = require('~/services/product.service.xxx')
const { findOneSku } = require('~/services/sku.service')
const { newSpu, findOneSpu } = require('~/services/spu.service')
// const ProductService = require('~/services/product.service')

class ProductController {
  /** SPU & SKU */
  createSpu = async (req, res, next) => {
    try {
      const spu = await newSpu({
        ...req.body,
        product_shop: req.user.userId
      })
      new SuccessResponse({
        message: 'Create new SPU successfully',
        metadata: spu
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  findOneSku = async (req, res, next) => {
    try {
      const { sku_id, product_id } = req.query
      new SuccessResponse({
        message: 'Get one sku successfully',
        metadata: await findOneSku({ sku_id, product_id })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  findOneSpu = async (req, res, next) => {
    try {
      const { product_id } = req.query
      new SuccessResponse({
        message: 'Get one spu successfully',
        metadata: await findOneSpu({ spu_id: product_id })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }
  /** SPU & SKU */

  createProduct = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Create new product successfully',
        metadata: await ProductService.createProduct(req.body.product_type, {
          ...req.body,
          product_shop: req.user.userId
        })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  updateProduct = async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  }

  publishProductByShop = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Published a product successfully',
        metadata: await ProductService.publishProductByShop({
          product_id: req.params.id,
          product_shop: req.user.userId
        })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  unpublishProductByShop = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Unpublished a product successfully',
        metadata: await ProductService.unpublishProductByShop({
          product_id: req.params.id,
          product_shop: req.user.userId
        })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @desc get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Get list of drafts successfully',
        metadata: await ProductService.findAllDraftsForShop({
          product_shop: req.user.userId
        })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  getAllPublishForShop = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Get list of published products successfully',
        metadata: await ProductService.findAllPublishForShop({
          product_shop: req.user.userId
        })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  getListSearchProducts = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Get list of searched products successfully',
        metadata: await ProductService.searchProducts(req.params)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  findAllProducts = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Find products successfully',
        metadata: await ProductService.findAllProducts(req.query)
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  findOneProduct = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Find one product successfully',
        metadata: await ProductService.findOneProduct({
          product_id: req.params.product_id
        })
      }).send(res)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ProductController()
