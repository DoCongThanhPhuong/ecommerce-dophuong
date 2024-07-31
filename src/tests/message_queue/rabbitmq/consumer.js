const amqp = require('amqplib')

const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'
    await channel.assertQueue(queueName, { durable: true })

    // sens msg
    channel.consume(
      queueName,
      (message) => {
        console.log('🚀 ~ runConsumer ~ message:', message.content.toString())
      },
      { noAck: true }
    )
  } catch (error) {
    console.error(error)
  }
}

runConsumer().catch(console.error)
