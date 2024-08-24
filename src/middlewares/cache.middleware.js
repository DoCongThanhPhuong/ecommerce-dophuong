'use strict'

const { SuccessResponse } = require('~/core/success.response')
const { getCacheIO } = require('~/models/repositories/cache.repo')
const { CACHE_PRODUCT } = require('~/utils/constants')

const readCache = async (req, res, next) => {
  const { sku_id } = req.query
  const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}`
  let skuCache = await getCacheIO({ key: skuKeyCache })
  if (!skuCache) return next()
  if (skuCache)
    new SuccessResponse({
      message: 'Get one sku successfully',
      metadata: { ...JSON.parse(skuCache), toLoad: 'cache middleware' }
    }).send(res)
}

module.exports = { readCache }
