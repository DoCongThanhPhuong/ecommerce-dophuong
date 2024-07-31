const amqp = require('amqplib')
const message = 'Hello, RabbitMQ for Thanh Phuong'

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'
    await channel.assertQueue(queueName, { durable: true })

    // sens msg
    channel.sendToQueue(queueName, Buffer.from(message))
    console.log('🚀 ~ runProducer ~ message:', message)
  } catch (error) {
    console.error(error)
  }
}

runProducer().catch(console.error)
