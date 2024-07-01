'use strict'

const { BadRequestError, NotFoundError } = require('~/core/error.response')
const discountModel = require('~/models/discount.model')
const {
  findAllDiscountCodesUnselect,
  checkDiscountExists
} = require('~/models/repositories/discount.repo')
const { findAllProducts } = require('~/models/repositories/product.repo')
const { convertToMongoDBObjectId } = require('~/utils')

/**
 * Discount Services
 * 1. Generate discount code (Shop | Admin)
 * 2. Get discount amount (User)
 * 3. Get all discounts (User | Shop)
 * 4. Verify discount code (User)
 * 5. Delete discount code (Shop | Admin)
 * 6. Cancel discount code (User)
 */

class DiscountService {
  static async createDiscountCode(reqBody) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user
    } = reqBody
    // check date
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
      throw new BadRequestError('Discount code has expired')
    if (new Date(start_date) >= new Date(end_date))
      throw new BadRequestError('Start date must be before end date')

    // create index for discount code
    const foundDiscount = checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shop_id: convertToMongoDBObjectId(shopId)
      }
    })

    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError('Discount code exists')

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_value: max_value,
      discount_uses_count: uses_count,
      discount_max_uses_per_users: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })

    return newDiscount
  }

  static async updateDiscount() {}

  static async getAllProductsByDiscountCode({
    code,
    shopId,
    userId,
    limit,
    page
  }) {
    const foundDiscount = discountModel
      .findOne({
        discount_code: code,
        discount_shop_id: convertToMongoDBObjectId(shopId)
      })
      .lean()

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new NotFoundError('Discount not exists')

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToMongoDBObjectId(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convertToMongoDBObjectId(shopId),
        discount_is_active: true
      },
      unselect: ['__v', 'discount_shop_id'],
      model: discountModel
    })
    return discounts
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {}
}
