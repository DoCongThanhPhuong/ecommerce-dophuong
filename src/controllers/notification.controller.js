'use strict'

const { SuccessResponse } = require('~/core/success.response')
const NotificationService = require('~/services/notification.service')

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list of notifications successfully',
      metadata: await NotificationService.listNotiByUser(req.query)
    }).send(res)
  }
}

module.exports = new NotificationController()
