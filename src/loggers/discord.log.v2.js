'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const { DISCORD_CHANNEL_ID, DISCORD_TOKEN } = process.env

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    this.channelId = DISCORD_CHANNEL_ID

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`)
    })

    this.client.login(DISCORD_TOKEN)
  }

  sendFormatCode(logData) {
    const {
      code,
      message = 'This is some additional information about the code.',
      title = 'Code example'
    } = logData
    // if (1 === 1) {
    // }
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
        }
      ]
    }
    this.sendMessage(codeMessage)
  }

  sendMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.channelId)
    if (!channel) {
      console.error('Could not find the channel', this.channelId)
      return
    }
    // Advanced: message use ChatGPT
    channel.send(message).catch((e) => console.error(e))
  }
}

module.exports = new LoggerService()
