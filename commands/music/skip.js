const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song!')
        .addIntegerOption((option) =>
        option
            .setName('queuenumber')
            .setDescription('Number of the song in the queue you want to skip to')
            .setRequired(false)
    ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const guildId = interaction.guild.id;
        const skipTo = interaction.options.getInteger('queuenumber')

        const Queue = client.player.GetQueue(guildId)
        if (!Queue || (Queue && !Queue.tracks[1])) {
            const ErrorEmbed = {
                title: 'Empty Queue',
                description:
                    "No Songs are playing in `Queue`\nOR, Next Track is not Present in Queue\nSongs can't be `Skipped`",
            }
            return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }
        const success = Queue.skip(skipTo ?? undefined)
        if (success) {
            const ReturnEmbed = {
                title: 'Songs has been Skipped',
            }
            return void (await interaction.editReply({ embeds: [ReturnEmbed] }))
        }

        const ErrorEmbed = {
            title: "Songs can't be Skipped",
        }
        return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
    },
}
