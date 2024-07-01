'use strict'

const {
  getUnselectedData,
  getSelectedData,
  convertToMongoDBObjectId
} = require('~/utils')

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
  model
}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectedData(select))
    .lean()
  return documents
}

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unselect,
  model
}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnselectedData(unselect))
    .lean()
  return documents
}

const checkDiscountExists = async ({ model, filter }) => {
  return model.findOne(filter).lean()
}

module.exports = {
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnselect,
  checkDiscountExists
}
