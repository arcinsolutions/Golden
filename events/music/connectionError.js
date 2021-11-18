const { MessageEmbed } = require('discord.js')

module.exports =
  ('connectionError',
  (client, ErrorMessage, queue, VoiceConnection, guildId) => {
    const Embed = new MessageEmbed()
      .setTitle('Music Player')
      .setDescription(
        `\`${ErrorMessage}\` Error for Guild -\`${queue.message.guild.name}\``,
      )
      .setColor('RED')
    return void queue.message.channel.send({ embeds: [Embed] })
  })
