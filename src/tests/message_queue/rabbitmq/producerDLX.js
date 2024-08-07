const amqp = require('amqplib')
const message = 'Hello, RabbitMQ for Thanh Phuong'

// const log = console.log

// console.log = function () {
//   log.apply(console, [new Date()].concat(arguments))
// }

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost')
    const channel = await connection.createChannel()

    const notificationExchange = 'notificationEx' // notificationEx direct'
    const notificationQueue = 'notificationQueueProcess' // assertQueue
    const notificationExchangeDLX = 'notificationExDLX'
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

    // 1. create Exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true
    })
    // 2. create Queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // cho phep cac ket noi truy cap vao hang doi cung mot luc
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    })
    // 3. bind Queue
    await channel.bindQueue(queueResult.queue, notificationExchange)
    // 4. send message
    const msg = 'A new product has just been created'
    console.log('🚀 ~ runProducer ~ msg:', msg)
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000'
    })

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)
  } catch (error) {
    console.error(error)
  }
}

runProducer()
  // .then((rs) => console.log(rs))
  .catch(console.error)
