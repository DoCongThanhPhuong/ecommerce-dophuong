'use strict'

const { SuccessResponse } = require('~/core/success.response')
const UserService = require('~/services/user.service')

class UserController {
  newUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Register user successfully',
      metadata: await UserService.newUser(req.body)
    }).send(res)
  }

  checkRegisterEmailToken = async (req, res, next) => {}
}

module.exports = new UserController()
