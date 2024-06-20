'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
  handleRefreshToken = async (req, res) => {
    // new SuccessResponse({
    //   message: 'Get token Successfully',
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
    // }).send(res)

    // V2 fixed, no need accessToken
    new SuccessResponse({
      message: 'Get token Successfully',
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  }

  logout = async (req, res) => {
    new SuccessResponse({
      message: 'Logout Successfully',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  login = async (req, res) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }
  signUp = async (req, res) => {
    new CREATED({
      message: 'Registered Successfully',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }
}

module.exports = new AccessController()
