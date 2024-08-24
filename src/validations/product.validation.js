'use strict'

const { BadRequestError } = require('~/core/error.response')

const validateProductQuery = (req, res, next) => {
  const { sku_id, product_id } = req.query

  if (!sku_id || !product_id)
    throw new BadRequestError('sku_id and product_id are required')

  const productIdPattern = /^\d{6}$/
  if (!productIdPattern.test(product_id))
    throw new BadRequestError('Invalid product_id')

  const skuIdPattern = /^\d{6}\.\d{6}$/
  if (!skuIdPattern.test(sku_id)) throw new BadRequestError('Invalid sku_id')

  const [skuPrefix] = sku_id.split('.')
  if (skuPrefix !== product_id) throw new BadRequestError('Invalid sku_id')

  next()
}

module.exports = { validateProductQuery }
