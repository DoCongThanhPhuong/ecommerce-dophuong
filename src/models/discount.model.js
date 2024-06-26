'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: { Type: String, required: true },
    discount_description: { Type: String, required: true },
    discount_type: { Type: String, default: 'fixed_amount' }, // percentage
    discount_value: { Type: Number, required: true },
    discount_code: { Type: String, required: true },
    discount_start_date: { Type: Date, required: true },
    discount_end_date: { Type: Date, required: true },
    discount_max_uses: { Type: Number, required: true },
    discount_uses_count: { Type: Number, required: true }, // so discount da su dung
    discount_users_used: { Type: Array, default: [] },
    discount_max_uses_per_users: { Type: Number, required: true },
    discount_min_order_value: { Type: Number, required: true },
    discount_shopId: { Type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { Type: Boolean, required: true },
    discount_applies_to: {
      Type: String,
      required: true,
      enum: ['all', 'specific']
    },
    discount_product_ids: { Type: Array, default: [] }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema)
