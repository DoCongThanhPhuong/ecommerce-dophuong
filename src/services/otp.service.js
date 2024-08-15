'use strict'

const crypto = require('node:crypto')
const { NotFoundError } = require('~/core/error.response')
const otpModel = require('~/models/otp.model')

const generateTokenRandom = () => {
  const token = crypto.randomInt(0, Math.pow(2, 32))
  return token
}

const newOtp = async ({ email }) => {
  const token = generateTokenRandom()
  const newToken = await otpModel.create({
    otp_token: token,
    otp_email: email
  })

  return newToken
}

const checkEmailToken = async ({ token }) => {
  // check token in model otp
  const foundToken = await otpModel.findOne({
    otp_token: token
  })
  if (!foundToken) throw new NotFoundError('Token not found')
  otpModel.deleteOne({ otp_token: token }).then()

  return foundToken
}

module.exports = {
  newOtp,
  checkEmailToken
}
