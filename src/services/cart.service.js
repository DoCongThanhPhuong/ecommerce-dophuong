'use strict'

const { NotFoundError } = require('~/core/error.response')
const { cart } = require('~/models/cart.model')
const { getProductById } = require('~/models/repositories/product.repo')

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
    const { productId } = product
    const foundProduct = await getProductById(productId)
    if (!foundProduct) throw new NotFoundError('Product does not exist')
    const { product_name, product_price } = foundProduct
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: {
            ...product,
            name: product_name,
            price: product_price
          }
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

  static async deleteUserCartItem({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: {
            productId
          }
        }
      }
    // Nên lưu lại sản phẩm đã xóa khỏi giỏ hàng để hạn chế đề xuất hoặc đề xuất khi sản phẩm đó có khuyến mãi
    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
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

  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      // eslint-disable-next-line no-unsafe-optional-chaining
      shop_order_ids[0]?.item_products[0]
    const foundProduct = await getProductById(productId)
    if (!foundProduct) throw new NotFoundError('Product does not exist')

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError('Product does not belong to the shop')

    if (quantity === 0) {
      CartService.deleteUserCartItem({ userId, productId })
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async getUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId
      })
      .lean()
  }
}

module.exports = CartService
