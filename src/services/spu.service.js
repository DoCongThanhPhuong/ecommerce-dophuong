'use strict'

const { NotFoundError } = require('~/core/error.response')
const { findShopById } = require('~/models/repositories/shop.repo')
const spuModel = require('~/models/spu.model')
const { randomProductId } = require('~/utils')
const { newSku, findAllSkusBySpu } = require('./sku.service')
const _ = require('lodash')

const newSpu = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = []
}) => {
  try {
    // 1. check if shop exists
    const foundShop = await findShopById({ shopId: product_shop })
    if (!foundShop) throw new NotFoundError('Shop not found')
    // 2. create a new SPU
    const spu = await spuModel.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop: foundShop._id,
      product_attributes,
      product_quantity,
      product_variations
    })

    // 3. get spu_id add to sku service
    if (spu && sku_list.length) {
      // create skus
      newSku({ sku_list, spu_id: spu.product_id }).then()
    }

    // 4. sync data via elasticsearch (search.service)

    // 5. return the created SPU
    return !!spu
  } catch (error) {
    throw error
  }
}

const findOneSpu = async ({ spu_id }) => {
  try {
    const spu = await spuModel.findOne({
      product_id: spu_id,
      isPublished: true
    })
    if (!spu) throw new NotFoundError('SPU not found')
    const skus = await findAllSkusBySpu({ product_id: spu.product_id })
    return {
      spu_info: _.omit(spu, ['__v', 'updatedAt', 'createdAt', 'isDeleted']),
      sku_list: skus
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  newSpu,
  findOneSpu
}
