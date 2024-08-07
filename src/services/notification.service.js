'use strict'

const { notification } = require('~/models/notification.model')
const { NOTIFICATION_TYPES } = require('~/utils/constants')

class NotificationService {
  static async pushNotiToSystem({
    type = NOTIFICATION_TYPES.SHOP001,
    senderId = 1,
    receiverId = 1,
    options = {}
  }) {
    let noti_content
    if ((type = NOTIFICATION_TYPES.SHOP001)) {
      noti_content = '@@@ has just created a new product: @@@@'
    } else if ((type = NOTIFICATION_TYPES.PROMOTION001)) {
      noti_content = '@@@ has just created a new voucher: @@@@@'
    }

    const newNotification = await notification.create({
      noti_type: type,
      noti_content: noti_content,
      noti_senderId: senderId,
      noti_receiverId: receiverId,
      noti_options: options
    })

    return newNotification
  }

  static async listNotiByUser({ userId = 1, type = 'ALL', isRead = '0' }) {
    const match = { noti_receiverId: userId }
    if (type !== 'ALL') {
      match.noti_type = type
    }

    return await notification.aggregate([
      { $match: match },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receiverId: 1,
          // noti_content: {
          //   $concat: [
          //     { $substr: ['$noti_options.shop', 0, -1] },
          //     ' has just created a new product: ',
          //     { $substr: ['$noti_options.product_name', 0, -1] }
          //   ]
          // },
          noti_content: 1,
          noti_options: 1,
          createdAt: 1
        }
      }
    ])
  }
}

module.exports = NotificationService
