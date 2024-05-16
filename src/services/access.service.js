'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keytoken.service')
const { SHOP_ROLES } = require('../utils/constants')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError
} = require('../core/error.response')
const { findByEmail } = require('./shop.service')

class AccessService {
  // check this token used?
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByUsedRefreshToken(
      refreshToken
    )
    if (foundToken) {
      // decode xem user la ai?
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      )
      console.log(
        '🚀 ~ AccessService ~ handleRefreshToken= ~ { userId, email }:',
        { userId, email }
      )
      // delete
      await KeyTokenService.deleteKeyByUserId(userId)
      throw new ForbiddenError('Something went wrong! Please re-login')
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registered')

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    )
    console.log(
      '🚀 ~ AccessService ~ handleRefreshToken= ~ { userId, email }:',
      { userId, email }
    )
    // check userId
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered')

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    )

    // update
    holderToken.refreshToken = tokens.refreshToken
    holderToken.usedRefreshTokens.push(refreshToken)
    await holderToken.save()

    return { user: { userId, email }, tokens }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }

  /*
    LOGIN
    1 - check email in dbs
    2 - match password
    3 - create access token and refresh token and save
    4 - generate tokens
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken }) => {
    // 1
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new BadRequestError('Shop not registered')
    // 2
    const match = await bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication error')
    // 3
    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')
    //4
    const { _id: userId } = foundShop
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })
    //5
    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop
      }),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    // try {
    // step 1: check email exists?
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered')
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [SHOP_ROLES.SHOP]
    })

    if (newShop) {
      // create publicKey, privateKey
      const publicKey = crypto.randomBytes(64).toString('hex')
      const privateKey = crypto.randomBytes(64).toString('hex')

      console.log({ publicKey, privateKey })

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      })

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'keyStore error!'
        }
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      )
      console.log(`Created Token Successfully::`, tokens)

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop
          }),
          tokens
        }
      }
    }

    return {
      code: 200,
      metadata: null
    }
    // } catch (error) {
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error'
    //   }
    // }
  }
}

module.exports = AccessService
