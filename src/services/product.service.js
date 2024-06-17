/* eslint-disable indent */
'use strict'

const { BadRequestError } = require('~/core/error.response')
const { product, clothing, electronic } = require('~/models/product.model')

// Define Factory class to create product
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Clothing': {
        console.log(payload)
        return new Clothing(payload).createProduct()
      }
      case 'Electronics':
        return new Electronic(payload).createProduct()
      default:
        throw new BadRequestError(`Invalid product type: ${type}`)
    }
  }
}

// Define basic product
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  // Create new product
  async createProduct() {
    return await product.create(this)
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) throw new BadRequestError('Create new clothing error')
    const newProduct = await super.createProduct()
    if (!newProduct) throw new BadRequestError('Create new clothing error')
    return newProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes)
    if (!newElectronic) throw new BadRequestError('Create new electronic error')
    const newProduct = await super.createProduct()
    if (!newProduct) throw new BadRequestError('Create new electronic error')
    return newProduct
  }
}

module.exports = ProductFactory
