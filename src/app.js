require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const { v4: uuidv4 } = require('uuid')
const myLogger = require('~/loggers/mylogger.log')
const app = express()

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// test pub/sub redis
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product:001', 10)

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id']
  req.requestId = requestId ? requestId : uuidv4()
  myLogger.log(`Input params:: ${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query
  ])
  next()
})

// init database
require('./dbs/init.mongodb')
const initRedis = require('./dbs/init.redis')
initRedis.initRedis()
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

const ioredis = require('./dbs/init.ioredis')
ioredis.init({
  IOREDIS_IS_ENABLED: true
})

// init elasticsearch
const initElasticsearch = require('./dbs/init.elasticsearch')
initElasticsearch.init({
  ELASTICSEARCH_IS_ENABLED: true
})

// init routes
app.use('/', require('./routes'))

// handling error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500

  const resMessage = `${error.status} - ${
    Date.now() - error.now
  }ms - response: ${JSON.stringify(error)}`
  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: error.message }
  ])

  const errorResponse = {
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  }

  if (process.env.NODE_ENV === 'dev') {
    errorResponse.stack = error.stack
  }

  return res.status(statusCode).json(errorResponse)
})

module.exports = app
