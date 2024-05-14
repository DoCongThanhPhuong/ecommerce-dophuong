'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { HEADER } = require('../utils/constants')
const { AuthFailureError, NotFoundError } = require('../core/error.response')

// service
const { findByUserId } = require('../services/keytoken.service')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })

    // refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify::`, err)
      } else {
        console.log(`decode verify::`, decode)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    throw error
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 - check userId missing?
   * 2 - get accessToken
   * 3 - verify Token
   * 4 - check user in dbs
   * 5 - check keyStore with this user
   * 6 - if OK => return next()
   */

  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')

  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not found keyStore')

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!userId) throw new AuthFailureError('Invalid Request')

  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodedUser.userId)
      throw new AuthFailureError('Invalid UserId')

    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

module.exports = {
  createTokenPair,
  authentication
}
