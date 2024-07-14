'use strict'

const { SuccessResponse } = require('~/core/success.response')
const CartService = require('~/services/cart.service')

class CartController {
  addToCart = async (req, res) => {
    new SuccessResponse({
      message: 'Add to cart successfully',
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }

  update = async (req, res) => {
    new SuccessResponse({
      message: 'Update cart successfully',
      metadata: await CartService.addToCartV2(req.body)
    }).send(res)
  }

  delete = async (req, res) => {
    new SuccessResponse({
      message: 'Delete cart successfully',
      metadata: await CartService.deleteUserCartItem(req.body)
    }).send(res)
  }

  getUserCart = async (req, res) => {
    new SuccessResponse({
      message: 'Get products in cart successfully',
      metadata: await CartService.getUserCart(req.query)
    }).send(res)
  }
}

module.exports = new CartController()
