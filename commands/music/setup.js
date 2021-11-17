const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup channel for Music related stuff!'),

    category: path.basename(__dirname),
  async execute (interaction, client) {
    const embed = new MessageEmbed()
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setTimestamp()

    let channel = "";
    const sent = await interaction.reply({
      embeds: [
        embed.setDescription(
          `**Creating new Channel...**`
        )
        .setColor('RED')
      ],
      fetchReply: true
    }).then(interaction.guild.channels.create('golden-music').then(thisChannel => {thisChannel.message('Test')}))

    interaction.editReply({
      embeds: [
        embed.setDescription(
          `**Channel created: <@test>**`
        ).setColor('DARK_GREEN')
      ]
    })
  }
}
