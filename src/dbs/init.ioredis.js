'use strict'

const Redis = require('ioredis')
const { RedisError } = require('~/core/error.response')

let clients = {},
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
    console.log('connectionIORedis - Connection status: connected')
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(connectRedisStatus.END, () => {
    console.log('connectionIORedis - Connection status: disconnected')
    // retry connecting
    handleTimeoutError()
  })

  connectionRedis.on(connectRedisStatus.RECONNECT, () => {
    console.log('connectionIORedis - Connection status: reconnecting')
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(connectRedisStatus.ERROR, (err) => {
    console.log(`connectionIORedis - Connection status: error ${err}`)
    clearTimeout(connectionTimeout) // Clear any timeout that might be pending
    // retry connecting
    handleTimeoutError()
  })
}

const init = ({
  IOREDIS_IS_ENABLED,
  IOREDIS_HOSTS = process.env.REDIS_CACHE_HOST,
  IOREDIS_PORT = 6379
}) => {
  if (IOREDIS_IS_ENABLED) {
    const redisInstance = new Redis({
      host: IOREDIS_HOSTS,
      port: IOREDIS_PORT
    })
    clients.connectedInstance = redisInstance
    handleEventConnection({ connectionRedis: redisInstance })
  }
}

const getIORedis = () => clients

const closeIORedis = () => {
  // if (clients.connectedInstance) {
  //   clients.connectedInstance.quit()
  //   console.log('Redis connection closed')
  // }
}

module.exports = {
  init,
  getIORedis,
  closeIORedis
}
