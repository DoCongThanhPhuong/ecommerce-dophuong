'use strict'

const shopModel = require('../shop.model')

const selectedFields = { name: 1, email: 1, status: 1, role: 1 }

const findShopById = async ({ shopId, select = selectedFields }) => {
  return await shopModel.findById(shopId).select(select)
}

module.exports = {
  findShopById
}
