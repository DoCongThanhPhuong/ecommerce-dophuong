'use strict'

const userModel = require('../user.model')

const findUserByEmail = async (email) => {
  const user = await userModel.findOne({ usr_email: email }).lean()
  return user
}

const createUser = async ({
  usr_id,
  usr_name,
  usr_slug,
  usr_email,
  usr_password,
  usr_role
}) => {
  const user = await userModel.create({
    usr_id,
    usr_name,
    usr_slug,
    usr_email,
    usr_password,
    usr_role
  })
  return user
}

module.exports = {
  findUserByEmail,
  createUser
}
