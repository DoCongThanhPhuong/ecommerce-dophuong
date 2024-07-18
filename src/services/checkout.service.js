'use strict'

const { NotFoundError, BadRequestError } = require('~/core/error.response')
const { findCartById } = require('~/models/repositories/cart.repo')
const { checkProductsByServer } = require('~/models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')
const { acquireLock, releaseLock } = require('./redis.service')
const { order } = require('~/models/order.model')

class CheckoutService {
  /**
   * cartId,
   * userId,
   * shop_order_ids:[
   *  {
   *    shopId,
   *    shop_discounts: [],
   *    item_products: [
   *        {
   *          productId
   *          price,
   *          quantity
   *        }
   *     ]
   *   }
   * ]
   *
   */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId exist
    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new NotFoundError('Cart does not exist')
    const checkout_order = {
        totalPrice: 0,
        shippingFee: 0,
        totalDiscount: 0,
        totalCheckout: 0
      },
      new_shop_order_ids = []

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = []
      } = shop_order_ids[i]
      // check product available
      const checkProductsServer = await checkProductsByServer(item_products)
      console.log(
        '🚀 ~ CheckoutService ~ checkoutReview ~ checkProductsServer:',
        checkProductsServer
      )
      if (!checkProductsServer) throw new BadRequestError('Order wrong')

      // tong tien don hang
      const checkoutPrice = checkProductsServer.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)
      console.log(
        '🚀 ~ CheckoutService ~ checkoutPrice ~ checkoutPrice:',
        checkoutPrice
      )

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductsServer
      }

      if (shop_discounts.length > 0) {
        // gia su chi co mot discount
        // get discount amount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          code: shop_discounts[0].code,
          userId,
          shopId,
          products: checkProductsServer
        })

        // tong discount giam gia
        checkout_order.totalDiscount += discount

        // neu tien giam gia > 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      new_shop_order_ids.push(itemCheckout)
    }

    return {
      shop_order_ids,
      new_shop_order_ids,
      checkout_order
    }
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { new_shop_order_ids, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids
      })

    // check lai mot lan nua xem vuot ton kho hay khong
    // get new array Products
    const products = new_shop_order_ids.flatMap((order) => order.item_products)
    console.log('🚀 ~ CheckoutService ~ products:', products)

    const acquireProducts = []
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await acquireLock(productId, quantity, cartId)
      acquireProducts.push(keyLock ? true : false)
      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    // check neu co san pham da het hang trong kho
    if (acquireProducts.includes(false)) {
      throw new BadRequestError(
        'Some products have been updated, please return to your cart'
      )
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: new_shop_order_ids
    })

    // truong hop neu insert thanh cong, thi remove prouduct co trong gio hang
    if (newOrder) {
      // remove products in cart
    }
    return newOrder
  }

  /**
   * 1. Query orders [Users]
   */
  static async getOrderByUser() {}

  /**
   * 2. Query an order using id [Users]
   */
  static async getOneOrderByUser() {}

  /**
   * 3. Cancel order [Users]
   */
  static async cancelOrderByUser() {}

  /**
   * 4. Update order status [Admin or Shop]
   */
  static async updateOrderStatus() {}
}

module.exports = CheckoutService
