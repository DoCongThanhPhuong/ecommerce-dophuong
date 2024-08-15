'use strict'

const { SuccessResponse } = require('~/core/success.response')
const UserService = require('~/services/user.service')

class UserController {
  newUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Send OTP successfully',
      metadata: await UserService.newUser(req.body)
    }).send(res)
  }

  checkRegisterEmailToken = async (req, res, next) => {
    const { token = null } = req.query
    const response = await UserService.checkRegisterEmailToken({ token })
    new SuccessResponse(response).send(res)
  }
}

module.exports = new UserController()
