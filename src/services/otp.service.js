'use strict'

const crypto = require('node:crypto')
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

module.exports = {
  newOtp
}
