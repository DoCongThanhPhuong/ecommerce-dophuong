'use strict'

const { Schema, model } = require('mongoose')
const { API_KEY_PERMISSIONS } = require('~/utils/constants')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'apikeys'

// Declare the Schema of the Mongo model
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      required: true,
      enum: API_KEY_PERMISSIONS
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema)
