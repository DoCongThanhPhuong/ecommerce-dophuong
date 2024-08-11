'use strict'

const { SuccessResponse } = require('~/core/success.response')
const DiscountService = require('~/services/discount.service')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Generate discount code successfully',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllProductsByDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all products by discount code successfully',
      metadata: await DiscountService.getAllProductsByDiscountCode({
        ...req.query
      })
    }).send(res)
  }

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all discount codes by shop successfully',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get discount amount successfully',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }
}

module.exports = new DiscountController()
