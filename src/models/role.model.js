'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'roles'

const roleSchema = new Schema(
  {
    rol_name: {
      type: String,
      default: 'user',
      enum: ['user', 'shop', 'admin']
    },
    rol_slug: { type: String, required: true },
    rol_status: {
      type: String,
      default: 'active',
      enum: ['pending', 'active', 'block']
    },
    rol_description: { type: String, default: '' },
    rol_grants: [
      {
        resourceId: {
          type: Schema.Types.ObjectId,
          ref: 'Resource',
          required: true
        },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: '*' }
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

module.exports = model(DOCUMENT_NAME, roleSchema)
