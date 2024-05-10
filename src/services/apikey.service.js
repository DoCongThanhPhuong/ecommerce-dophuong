'use strict'

const apikeyModel = require('../models/apikey.model')
const crypto = require('node:crypto')

const findById = async (key) => {
  //   const newKey = await apikeyModel.create({
  //     key: crypto.randomBytes(64).toString('hex'),
  //     permissions: ['0000']
  //   })
  //   console.log('🚀 ~ findById ~ newKey:', newKey)
  const objKey = await apikeyModel.findOne({ key, status: true }).lean()
  return objKey
}

module.exports = {
  findById
}
