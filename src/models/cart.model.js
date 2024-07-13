'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

// Declare the Schema of the Mongo model
const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active'
    },
    cart_products: { type: Array, required: true, default: [] }, // productId, shopId, quantity, name, price
    cart_product_count: { type: Number, required: true },
    cart_userId: { type: Schema.Types.ObjectId, required: true }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
//Export the model
module.exports = { cart: model(DOCUMENT_NAME, cartSchema) }
