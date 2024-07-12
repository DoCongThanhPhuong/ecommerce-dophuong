'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const getSelectedData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}

const getUnselectedData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object')
      removeUndefinedObject(obj[key])
    else if (obj[key] == null) delete obj[key]
  })
  return obj
}

const updateNestedObjectParser = (obj) => {
  const final = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key])
      Object.keys(response).forEach((a) => {
        final[`${key}.${a}`] = response[a]
      })
    } else {
      final[key] = obj[key]
    }
  })
  return final
}

const convertToMongoDBObjectId = (id) => new Types.ObjectId(id)

module.exports = {
  getInfoData,
  getSelectedData,
  getUnselectedData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToMongoDBObjectId
}
