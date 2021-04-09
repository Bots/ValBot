const Discord = require('discord.js')
const AWS = require('aws-sdk')
const {
  LightsailClient,
  AllocateStaticIpCommand
} = require('@aws-sdk/client-lightsail')

require('dotenv').config()

const client = new Discord.Client()
const PREFIX = '!'
const awsRegion = process.env.AWS_REGION
const awsPort = process.env.AWS_PORT
const attachment = new Discord.MessageAttachment('./assets/valheim.png', 'sample.png');

const awsCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
}

AWS.config.update({
  credentials: awsCredentials,
  region: awsRegion
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
              .attachFiles(attachment)
              .setThumbnail('attachment://sample.png')
              .addFields(
                {
                  name: 'Public IP/Port',
                  value: `${data.instances[0].publicIpAddress}:${awsPort}`
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
        lightsail.startInstance({ instanceName: process.env.AWS_LIGHTSAIL_INSTANCE_NAME }, (err, data) => {
          if (err) console.log(err, err.stack)
          else {
            const startEmbed = new Discord.MessageEmbed()
              .setColor('RED')
              .setTitle('Starting Server...')
              .attachFiles(attachment)
              .setThumbnail('attachment://sample.png')
              .setFooter(
                'Copyright 2021 BotsOne Labs, Source Code: https://github.com/Bots/ValBot/'
              )
            console.log(data)
            message.channel.send(startEmbed)
          }
        })
        break

      case 'ValheimStop':
        lightsail.stopInstance({ instanceName: process.env.AWS_LIGHTSAIL_INSTANCE_NAME }, (err, data) => {
          if (err) console.log(err, err.stack)
          else {
            const stopEmbed = new Discord.MessageEmbed()
              .setColor('RED')
              .setTitle('Stopping Server...')
              .attachFiles(attachment)
              .setThumbnail('attachment://sample.png')
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
