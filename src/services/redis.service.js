'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('~/models/repositories/inventory.repo')
const redisClient = redis.createClient()

redisClient.ping((err, result) => {
  if (err) {
    console.err('Error connecting to Redis::', err)
  } else {
    console.log('Connected to Redis')
  }
})

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`
  const retryTimes = 10
  const expireTime = 3000 // 3 seconds tam lock
  for (let i = 0; i < retryTimes; i++) {
    // tao mot key, nguoi nam giu key thi duoc vao thanh toan
    const result = await setnxAsync(key, expireTime)
    console.log('🚀 ~ acquireLock ~  result:', result)
    if (result === 1) {
      // thao tac voi inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId
      })
      if (isReservation.modifiedCount > 0) {
        await pexpire(key, expireTime)
        return key
      }
      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
}
