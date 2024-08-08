'use strict'
const amqp = require('amqplib')

async function consumerOrderedMessage() {
  const connection = await amqp.connect('amqp://guest:123456@localhost')
  const channel = await connection.createChannel()
  const queueName = 'orderd-messages-queue'
  await channel.assertQueue(queueName, { durable: true })

  // set prefectch to ensure that only one message is processed at a time
  channel.prefetch(1)

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString()

    setTimeout(() => {
      console.log('processed message:', message)
      channel.ack(msg)
    }, Math.random() * 1000)
  })
}

consumerOrderedMessage().catch((err) => console.error(err))
