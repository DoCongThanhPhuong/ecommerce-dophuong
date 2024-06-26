'use strict'

const { BadRequestError } = require('~/core/error.response')
const {
  product,
  clothing,
  electronic,
  furniture
} = require('~/models/product.model')
const { insertInventory } = require('~/models/repositories/inventory.repo')
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unpublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findOneProduct,
  updateProductById
} = require('~/models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('~/utils')

// Define Factory class to create product
class ProductFactory {
  static productRegistry = {}

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`)
    return new productClass(payload).createProduct()
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`)
    return new productClass(payload).updateProduct(productId)
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id })
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop({ query, limit, skip })
  }

  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({ keySearch })
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true }
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb']
    })
  }

  // Details
  static async findOneProduct({ product_id }) {
    return await findOneProduct({ product_id, unselect: ['__v'] })
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
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id })
    if (newProduct) {
      // add product stock in inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }
    return newProduct
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ model: product, productId, bodyUpdate })
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new BadRequestError('Create new clothing error')
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('Create new clothing error')
    return newProduct
  }

  async updateProduct(productId) {
    // 1. remove attr null or undefined
    const objectParams = removeUndefinedObject(this)
    // 2. check xem update ở đâu?
    if (objectParams.product_attributes) {
      await updateProductById({
        model: clothing,
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes)
      })
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    )
    return updateProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new BadRequestError('Create new electronic error')
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new electronic error')
    return newProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture) throw new BadRequestError('Create new furniture error')
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError('Create new furniture error')
    return newProduct
  }
}

ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory
