const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or a PlayList!')
        .addStringOption((option) =>
            option
                .setName('song')
                .setDescription('YouTube, Soundcloud, Spotify url or Songtitle')
                .setRequired(true)
        ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const guildId = interaction.guild.id
        const request = interaction.options.getString('song')

        const Queue =
            client.player.GetQueue(guildId) ??
            client.player.CreateQueue(interaction)
        const success = await Queue.play(
            request,
            interaction.member.voice.channel,
            interaction.member
        )

        if (success) {
            const ReturnEmbed = {
                title: 'Searching for this song..',
            }
            return void (await interaction.editReply({ embeds: [ReturnEmbed] }))
        }

        const ErrorEmbed = {
            title: "Songs can't be played. Please try again",
        }
        return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
    },
}
