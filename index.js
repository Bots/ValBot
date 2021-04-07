const Discord = require('discord.js')
const AWS = require('aws-sdk')
const {
  LightsailClient,
  AllocateStaticIpCommand
} = require('@aws-sdk/client-lightsail')

require('dotenv').config()

const client = new Discord.Client()
const PREFIX = '!'

const awsCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
}

AWS.config.update({
  credentials: awsCredentials,
  region: 'us-west-2'
})

const lightsail = new AWS.Lightsail()

client.login(process.env.DISCORD_BOT_TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async (message) => {
  if (message.author.equals(client.user)) return
  else {
    if (!message.content.startsWith(PREFIX)) return

    const args = message.content.substring(PREFIX.length).split(' ')

    switch (args[0]) {
      case 'ValheimStatus':
        lightsail.getInstances((err, data) => {
          if (err) console.log(err, err.stack)
          else {
            const statusEmbed = new Discord.MessageEmbed()
              .setColor('RED')
              .setTitle('Server Status:')
              .addFields(
                {
                  name: 'Public IP/Port',
                  value: `${data.instances[0].publicIpAddress}:2456`
                },
                { name: 'Password', value: process.env.VALHEIM_PASSWORD },
                { name: 'Server Status', value: data.instances[0].state.name }
              )
              .setFooter(
                'Copyright 2021 BotsOne Labs, Source Code: https://github.com/Bots/ValBot/'
              )
            console.log(data)
            message.channel.send(statusEmbed)
          }
        })
        break

      case 'ValheimStart':
        lightsail.startInstance({ instanceName: 'Valheim_1' }, (err, data) => {
          if (err) console.log(err, err.stack)
          else {
            const startEmbed = new Discord.MessageEmbed()
              .setColor('RED')
              .setTitle('Starting Server...')
              .setFooter(
                'Copyright 2021 BotsOne Labs, Source Code: https://github.com/Bots/ValBot/'
              )
            console.log(data)
            message.channel.send(startEmbed)
          }
        })
        break

      case 'ValheimStop':
        lightsail.stopInstance({ instanceName: 'Valheim_1' }, (err, data) => {
          if (err) console.log(err, err.stack)
          else {
            const stopEmbed = new Discord.MessageEmbed()
              .setColor('RED')
              .setTitle('Stopping Server...')
              .setFooter(
                'Copyright 2021 BotsOne Labs, Source Code: https://github.com/Bots/ValBot/'
              )
            console.log(data)
            message.channel.send(stopEmbed)
          }
        })
        break
    }
  }
})
