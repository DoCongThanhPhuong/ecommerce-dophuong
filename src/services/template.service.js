'use strict'

const templateModel = require('~/models/template.model')
// const { emailTokenHTML } = require('~/utils/template.html')

const newTemplate = async ({ tem_id = 0, tem_name, tem_html }) => {
  // 1. check if template exists
  // 2. create new template
  const newTemplate = await templateModel.create({
    tem_id,
    tem_name, // unique
    tem_html
  })

  return newTemplate
}

const getTemplate = async ({ tem_name }) => {
  const template = await templateModel.findOne({ tem_name })
  return template
}

module.exports = {
  newTemplate,
  getTemplate
}
