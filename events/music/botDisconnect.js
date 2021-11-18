const { MessageEmbed } = require('discord.js')

module.exports =
  ('botDisconnect',
  (client, queue, VoiceChannel) => {
    const Embed = new MessageEmbed()
      .setTitle('Music Player')
      .setDescription(
        `Bot has been \`Disconnected\` from ${
          VoiceChannel ? `<#${VoiceChannel.id}>` : 'Unknown/Deleted Channel'
        }`,
      )
      .setColor('RED')
    return void queue.message.channel.send({ embeds: [Embed] })
  })
