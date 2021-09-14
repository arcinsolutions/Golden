const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute (interaction, client) {
    let embed = new MessageEmbed()
      .setColor('GREEN')
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setTimestamp()

    const sent = await interaction.reply({
      embeds: [
        embed.setDescription(
          `**Pinging...**`
        )
      ],
      fetchReply: true
    })

    interaction.editReply({
      embeds: [
        embed.setDescription(
          `**Roundtrip latency: ${sent.createdTimestamp -
            interaction.createdTimestamp}ms**`
        )
      ]
    })
  }
}
