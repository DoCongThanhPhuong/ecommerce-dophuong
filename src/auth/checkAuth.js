'use strict'

const { ForbiddenError } = require('~/core/error.response')
const { findById } = require('../services/apikey.service')
const { HEADER } = require('../utils/constants')

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({ message: 'Forbidden Error' })
    }
    // check objKey
    const objKey = await findById(key)
    if (!objKey) {
      return res.status(403).json({ message: 'Forbidden Error' })
    }
    req.objKey = objKey
    return next()
  } catch (error) {
    throw new ForbiddenError('Forbidden Error')
  }
}

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: 'Permission Denied' })
    }

    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({ message: 'Permission Denied' })
    }

    return next()
  }
}

module.exports = {
  apiKey,
  permission
}
