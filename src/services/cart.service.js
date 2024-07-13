'use strict'

const { cart } = require('~/models/cart.model')

/**
 * Key features: Cart Service [User]
 * 1 - Add product to cart
 * 2 - Reduce product quantity
 * 3 - Increase product quantity'
 * 4 - Get products in cart
 * 5 - Delete cart
 * 6 - Delete cart item
 */

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product
        }
      },
      options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity
        }
      },
      options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateSet, options)
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId })
    if (!userCart) {
      // create cart for user
      return await CartService.createUserCart({ userId, product })
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    return await CartService.updateUserCartQuantity({ userId, product })
  }
}

module.exports = CartService
