'use strict'

const { Schema, model } = require('mongoose')
const { default: slugify } = require('slugify')

const DOCUMENT_NAME = 'Spu'
const COLLECTION_NAME = 'spus'

const spuSchema = new Schema(
  {
    product_id: { type: String, default: '' },
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_category: { type: Array, default: [] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, require: true },
    product_ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

spuSchema.index({ product_name: 'text', product_description: 'text' })

spuSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

module.exports = model(DOCUMENT_NAME, spuSchema)
