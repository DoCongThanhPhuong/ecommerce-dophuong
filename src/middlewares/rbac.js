'use strict'

const { AuthFailureError } = require('~/core/error.response')
const rbac = require('./role.middleware')
const { roleList } = require('~/services/rbac.service')

/**
 *
 * @param {*} action - read, update or delete
 * @param {*} resource - profile, balance, ...
 */

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(
        await roleList({
          userId: 9999
        })
      )
      const rol_name = req.query.role
      const permission = await rbac.can(rol_name)[action](resource)
      if (!permission.granted)
        throw new AuthFailureError('You do not have enough permissions')

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { grantAccess }
