'use strict'

const { SuccessResponse } = require('~/core/success.response')

const data = [
  { usr_id: 1, usr_name: 'CR7', usr_avatar: 'image.com/id/1' },
  { usr_id: 2, usr_name: 'Messi', usr_avatar: 'image.com/id/2' },
  { usr_id: 3, usr_name: 'Tucker', usr_avatar: 'image.com/id/3' }
]

class ProfileController {
  profiles = async (req, res, next) => {
    new SuccessResponse({
      message: 'View all profiles',
      metadata: data
    }).send(res)
  }

  profile = async (req, res, next) => {
    new SuccessResponse({
      message: 'View profile',
      metadata: { usr_id: 3, usr_name: 'Tucker', usr_avatar: 'image.com/id/3' }
    }).send(res)
  }
}

module.exports = new ProfileController()
