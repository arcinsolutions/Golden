const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current song!'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const guildId = interaction.guild.id;

        const Queue = client.player.GetQueue(guildId)
        if (!Queue || (Queue && !Queue.tracks[0])) {
          const ErrorEmbed = {
            title: 'Empty Queue',
            description:
              "No Songs are playing in `Queue`\nOR, Next Track is not Present in Queue\nSongs can't be `Resumed/Un-Paused`",
          }
          return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }
        const success = Queue.resume()
        if (success) {
          const ReturnEmbed = {
            title: 'Songs has been Resumed/Un-Paused',
          }
          return void (await interaction.editReply({ embeds: [ReturnEmbed] }))
        }
        const ErrorEmbed = {
          title: "Songs can't be Resumed/Un-Paused",
        }
        return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
    },
}
