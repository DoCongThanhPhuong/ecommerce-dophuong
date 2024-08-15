'use strict'

const _ = require('lodash')
const { NotFoundError } = require('~/core/error.response')
const skuModel = require('~/models/sku.model')
const spuModel = require('~/models/spu.model')
const { randomProductId } = require('~/utils')

const newSku = async ({ spu_id, sku_list }) => {
  try {
    const convertedSkuList = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId()}`
      }
    })
    const skus = await skuModel.create(convertedSkuList)
    return skus
  } catch (error) {
    return {}
  }
}

const findOneSku = async ({ sku_id, product_id }) => {
  try {
    // read cache
    const sku = await skuModel.findOne({ sku_id, product_id }).lean()
    if (sku) {
      // set cache
    }
    return _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
  } catch (error) {
    throw error
  }
}

const findAllSkusBySpu = async ({ product_id }) => {
  try {
    // 1. check spu_id
    const spu = await spuModel.findOne({ product_id })
    if (!spu) throw new NotFoundError('Spu not found')
    // 2. find all skus by spu_id
    const skus = await skuModel.find({ product_id }).lean()
    return skus.map((sku) =>
      _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
    )
  } catch (error) {
    throw error
  }
}

module.exports = {
  newSku,
  findOneSku,
  findAllSkusBySpu
}
