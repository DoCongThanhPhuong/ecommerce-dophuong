'use strict'

const { convertToMongoDBObjectId } = require('~/utils')
const { cart } = require('../cart.model')

const findCartById = async (cardId) => {
  return cart
    .findOne({
      _id: convertToMongoDBObjectId(cardId),
      cart_state: 'active'
    })
    .lean()
}

module.exports = {
  findCartById
}
