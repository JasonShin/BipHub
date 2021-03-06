import Discord from 'discord.js'
import client from 'socket.io-client'
import config from './config'
import password from '../.password/discord.password'

function init() {
  const socket = client('http://localhost:8080/', { query: `appName=${config.name}` })

  // General Socket.io client events
  socket.on('connect', () => {
    socket.emit('REGISTER_APP', config)
  })
  socket.on('testEvent', () => {
  })
  socket.on('disconnect', () => {
  })
  const discordClient = new Discord.Client()

  // General Discord events
  // 1. On connect
  discordClient.on('ready', () => {
    console.log('INFO: Discord app ready')
  })

  // Discord Incoming Events
  // 1. on message
  discordClient.on('message', (message) => {
    // Note: simply declare messages as if else
    if (message.type === 'DEFAULT') {
      console.log('INFO discord message ', message, '  ', config.incomingActions.message)
      socket.emit('INCOMING_ACTION', {
        data: {
          content: message.content
        },
        meta: config.incomingActions.message,
      })
    }
  })

  discordClient.login(password.token)

  // Incoming action conditions check
  // 1. message contains
  socket.on('biphub-discord_message_contains', (payload, reply) => {
    console.log('message check payload  ', payload)
    if (payload && payload.data.includes(payload.testCase)) {
      console.log('INFO: discord passed on message conditions test!')
      return reply({
        success: true
      })
    } else {
      console.log('WARN: discord failed contains test!')
      return reply({
        success: false
      })
    }
  })
}

export default {
  init,
}
