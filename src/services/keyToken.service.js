'use strict'

const { Types } = require('mongoose')
const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken
  }) => {
    try {
      //lv 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      // level xxx
      const filter = { user: userId }
      const update = {
        publicKey,
        privateKey,
        usedRefreshTokens: [],
        refreshToken
      }
      const options = { upsert: true, new: true }
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      )
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id })
  }

  static findByUsedRefreshToken = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ usedRefreshTokens: refreshToken })
      .lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken })
  }

  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId })
  }
}

module.exports = KeyTokenService
