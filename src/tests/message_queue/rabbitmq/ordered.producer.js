'use strict'
const amqp = require('amqplib')

async function consumerOrderedMessage() {
  const connection = await amqp.connect('amqp://guest:123456@localhost')
  const channel = await connection.createChannel()
  const queueName = 'orderd-messages-queue'
  await channel.assertQueue(queueName, { durable: true })

  for (let i = 0; i < 10; i++) {
    const message = `ordered-message:: ${i + 1}`
    console.log(`message: '${message}'`)
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true })
  }

  setTimeout(() => {
    connection.close()
  }, 1000)
}

consumerOrderedMessage().catch((err) => console.error(err))
