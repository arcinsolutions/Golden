const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute (interaction, client) {
    const embed = new MessageEmbed()
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setTimestamp()

    const sent = await interaction.reply({
      embeds: [
        embed.setDescription(
          `**Pinging...**`
        )
        .setColor('RED')
      ],
      fetchReply: true
    })

    interaction.editReply({
      embeds: [
        embed.setDescription(
          `**Roundtrip latency: ${sent.createdTimestamp -
            interaction.createdTimestamp}ms**`
        ).setColor('DARK_GREEN')
      ]
    })
  }
}
