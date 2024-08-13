'use strict'

const redis = require('redis')
const { RedisError } = require('~/core/error.response')

// // create a new client redis
// const client = redis.createClient({
//   host,
//   port,
//   username,
//   password
// })

// client.on('error', (err) => {
//   console.error(`Error connecting to Redis: ${err}`)
// })

// module.exports = client

let client = {},
  connectRedisStatus = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
  },
  connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vn: 'Redis loi ket noi',
      en: 'Redis connection error'
    }
  }

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisError(
      REDIS_CONNECT_MESSAGE.message.en,
      REDIS_CONNECT_MESSAGE.code
    )
  }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(connectRedisStatus.CONNECT, () => {
    console.log('connectionRedis - Connection status: connected')
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(connectRedisStatus.END, () => {
    console.log('connectionRedis - Connection status: disconnected')
    // retry connecting
    handleTimeoutError()
  })

  connectionRedis.on(connectRedisStatus.RECONNECT, () => {
    console.log('connectionRedis - Connection status: reconnecting')
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(connectRedisStatus.ERROR, (err) => {
    console.log(`connectionRedis - Connection status: error ${err}`)
    clearTimeout(connectionTimeout) // Clear any timeout that might be pending
    // retry connecting
    handleTimeoutError()
  })
}

const initRedis = () => {
  const redisInstance = redis.createClient()
  client.connectedInstance = redisInstance
  handleEventConnection({ connectionRedis: redisInstance })
}

const getRedis = () => client

const closeRedis = () => {
  if (client.connectedInstance) {
    client.connectedInstance.quit()
    console.log('Redis connection closed')
  }
}

module.exports = {
  initRedis,
  getRedis,
  closeRedis
}
