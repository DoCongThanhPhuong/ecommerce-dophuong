'use strict'

const {
  BadRequestError,
  NotFoundError,
  InternalServerError
} = require('~/core/error.response')
const userModel = require('~/models/user.model')
const { sendEmailToken } = require('./email.service')
const { checkEmailToken } = require('./otp.service')
const {
  findUserByEmail,
  createUser
} = require('~/models/repositories/user.repo')
const { getInfoData, convertToMongoDBObjectId } = require('~/utils')
const { createTokenPair } = require('~/auth/authUtils')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keytoken.service')

class UserService {
  static async newUser({ email = null, captcha = null }) {
    // 1. Check email if exists in dbs
    const user = await userModel.findOne({ email }).lean()
    // 2. if email already exists
    if (user) throw new BadRequestError('Email already exists')
    // 3. send token via email
    const token = await sendEmailToken({ email })
    return { token }
  }

  static async checkRegisterEmailToken({ token }) {
    try {
      // 1. check token in mail OTP
      const { otp_email: email } = await checkEmailToken({ token })
      if (!email) throw new NotFoundError('Token not found')
      // 2. check email exists in database
      const foundUser = await findUserByEmail(email)
      if (foundUser) throw new BadRequestError('Email already exists')

      const passwordHash = await bcrypt.hash(email, 10)
      // step 3: create new user
      const newUser = await createUser({
        usr_id: 1,
        usr_slug: 'u00001',
        usr_name: email,
        usr_email: email,
        usr_password: passwordHash,
        usr_role: convertToMongoDBObjectId('66b8b925aea06c9aac31f45a')
      })

      if (newUser) {
        // create publicKey, privateKey
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        // create token pair
        const tokens = await createTokenPair(
          { userId: newUser._id, email },
          publicKey,
          privateKey
        )

        // create KeyToken with refreshToken
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
          privateKey,
          refreshToken: tokens.refreshToken
        })

        if (!keyStore)
          throw new InternalServerError('Failed to create keystore')

        console.log('Created Token Successfully::', tokens)
        return {
          statusCode: 201,
          message: 'Register successfully',
          metadata: {
            user: getInfoData({
              fields: ['usr_id', 'usr_name', 'usr_email'],
              object: newUser
            }),
            tokens
          }
        }
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = UserService
