'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keytoken.service')
const { SHOP_ROLES } = require('../utils/constants')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const {
  BadRequestError,
  ConflictRequestError
} = require('../core/error.response')

class AccessService {
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
