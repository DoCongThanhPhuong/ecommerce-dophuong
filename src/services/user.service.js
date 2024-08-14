'use strict'

const { BadRequestError } = require('~/core/error.response')
const userModel = require('~/models/user.model')
const { sendEmailToken } = require('./email.service')
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
}

module.exports = UserService
