'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const { PRODUCT_TYPES } = require('../utils/constants')
const { default: slugify } = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: {
      type: String,
      require: true
    },
    product_thumb: {
      type: String,
      require: true
    },
    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      require: true
    },
    product_quantity: {
      type: Number,
      require: true
    },
    product_type: {
      type: String,
      require: true,
      enum: PRODUCT_TYPES
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      require: true
    },
    product_ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
      type: Array,
      default: []
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

// Create index
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middleware: run before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      require: true
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    timestamps: true,
    collection: 'clothes'
  }
)

const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      require: true
    },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    timestamps: true,
    collection: 'electronics'
  }
)

const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
      require: true
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    timestamps: true,
    collection: 'furniture'
  }
)

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronic: model('Electronic', electronicSchema),
  furniture: model('Furniture', furnitureSchema)
}
