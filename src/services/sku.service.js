'use strict'

const _ = require('lodash')
const { NotFoundError } = require('~/core/error.response')
const { setCacheIOExpiration } = require('~/models/repositories/cache.repo')
const skuModel = require('~/models/sku.model')
const spuModel = require('~/models/spu.model')
const { randomProductId } = require('~/utils')
const { CACHE_PRODUCT } = require('~/utils/constants')

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
    // 1. check params
    if (sku_id < 0) return null
    if (product_id < 0) return null

    // 2. read cache
    const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}` // key cache
    // let skuCache = await getCacheIO({ key: skuKeyCache })
    // if (skuCache) return { ...JSON.parse(skuCache), toLoad: 'cache' }

    // 3. read database
    // if (!skuCache) {
    const skuCache = await skuModel.findOne({ sku_id, product_id }).lean()
    const valueCache = skuCache ? skuCache : null

    setCacheIOExpiration({
      key: skuKeyCache,
      value: JSON.stringify(valueCache),
      expirationInSeconds: 30
    }).then()
    // }

    return { ...skuCache, toLoad: 'dbs' }
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
