'use strict'

const { Schema, model } = require('mongoose')
const { ORDER_STATUS } = require('~/utils/constants')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} }, // totalPrice, totalApplyDiscount, shippingFee
    order_shipping: { type: Object, default: {} }, // street, city, state, country
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#0000123082024' },
    order_status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
//Export the model
module.exports = { order: model(DOCUMENT_NAME, orderSchema) }
