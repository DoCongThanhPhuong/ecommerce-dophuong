'use strict'

const { SuccessResponse } = require('~/core/success.response')
const {
  createRole,
  createResource,
  roleList,
  resourceList
} = require('~/services/rbac.service')

const newRole = async (req, res, next) => {
  new SuccessResponse({
    message: 'New role created successfully',
    metadata: await createRole(req.body)
  }).send(res)
}

const newResource = async (req, res, next) => {
  new SuccessResponse({
    message: 'New resource created successfully',
    metadata: await createResource(req.body)
  }).send(res)
}

const listRoles = async (req, res, next) => {
  new SuccessResponse({
    message: 'Get role list successfully',
    metadata: await roleList(req.query)
  }).send(res)
}

const listResources = async (req, res, next) => {
  new SuccessResponse({
    message: 'Get resource list successfully',
    metadata: await resourceList(req.query)
  }).send(res)
}

module.exports = { newRole, newResource, listRoles, listResources }
