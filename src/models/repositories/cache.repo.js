'use strict'

const { getIORedis } = require('~/dbs/init.ioredis')

const redisCache = getIORedis().connectedInstance

const setCacheIO = async ({ key, value }) => {
  if (!redisCache) throw new Error('Redis client is not initialized')
  try {
    return await redisCache.set(key, value)
  } catch (error) {
    throw new Error(`setCacheIO error: ${error.message}`)
  }
}

const setCacheIOExpiration = async ({ key, value, expirationInSeconds }) => {
  if (!redisCache) throw new Error('Redis client is not initialized')
  try {
    return await redisCache.set(key, value, 'EX', expirationInSeconds)
  } catch (error) {
    throw new Error(`setCacheIOExpiration error: ${error.message}`)
  }
}

const getCacheIO = async ({ key }) => {
  if (!redisCache) throw new Error('Redis client is not initialized')
  try {
    return await redisCache.get(key)
  } catch (error) {
    throw new Error(`setCacheIOExpiration error: ${error.message}`)
  }
}

module.exports = {
  setCacheIO,
  setCacheIOExpiration,
  getCacheIO
}
