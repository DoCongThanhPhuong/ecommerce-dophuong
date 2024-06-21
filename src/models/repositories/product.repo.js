'use strict'

const { Types } = require('mongoose')
const { product } = require('../product.model')
const { getSelectedData, getUnselectedData } = require('~/utils')

const queryProducts = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return queryProducts({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return queryProducts({ query, limit, skip })
}

const searchProductsByUser = async ({ keySearch }) => {
  const searchRegex = new RegExp(keySearch)
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: searchRegex }
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return results
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })
  if (!foundShop) return null
  foundShop.isDraft = false
  foundShop.isPublished = true
  const updateResult = await product.updateOne(
    { _id: foundShop._id },
    { $set: foundShop }
  )
  const { modifiedCount } = updateResult
  return modifiedCount
}

const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })
  if (!foundShop) return null
  foundShop.isDraft = true
  foundShop.isPublished = false
  const updateResult = await product.updateOne(
    { _id: foundShop._id },
    { $set: foundShop }
  )
  const { modifiedCount } = updateResult
  return modifiedCount
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectedData(select))
    .lean()
  return products
}

const findOneProduct = async ({ product_id, unselect }) => {
  return product.findById(product_id).select(getUnselectedData(unselect))
}

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
}

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findOneProduct,
  updateProductById
}
