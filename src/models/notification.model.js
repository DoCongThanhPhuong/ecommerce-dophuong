'use strict'

const { Schema, model } = require('mongoose')
const { NOTIFICATION_TYPES } = require('~/utils/constants')

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-001: new promotion
// SHOP-001: following shop created new product
const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      require: true
    },
    noti_senderId: { type: Schema.Types.ObjectId, require: true, ref: 'Shop' },
    noti_receiverId: { type: Number, require: true },
    noti_content: { type: String, require: true },
    noti_options: { type: Object, default: {} }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
//Export the model
module.exports = { notification: model(DOCUMENT_NAME, notificationSchema) }
