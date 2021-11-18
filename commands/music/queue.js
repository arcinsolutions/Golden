const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('let you see the current Queue')
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('amountt')
                .setRequired(false)
        ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const guildId = interaction.guild.id;
        const amount = interaction.options.getInteger('amount') // KA WAS DAS MACHT

        const Queue = client.player.GetQueue(guildId)
        if (!Queue || (Queue && !Queue.current)) {
            const ErrorEmbed = {
                title: 'Empty Queue',
                description:
                    "No Songs are playing in `Queue`\nSong can't be `Fetched from Queue`",
            }
            return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }
        var Index =
        amount &&
            Number(amount) &&
            Number(amount) < Queue.tracks.length &&
            Number(amount) > 0
                ? Number(amount)
                : 0

        var StringArrays = Queue.tracks.map(
            (track, index) =>
                `**Track Index :** \`${index}\`\n**Track ID :** \`${track.Id}\`\n**Name :** \`${track.title}\`\n**Author :** \`${track.channelId}\`\n**Duration :** \`${track.human_duration}\`\n**URl :** [Track Url](${track.url})\n`
        )
        StringArrays = StringArrays.slice(Index, Index + 5)
        StringArrays = StringArrays.filter(Boolean)
        if (Queue.tracks.length > StringArrays.length) {
            StringArrays.push(
                `More \`${Number(
                    Queue.tracks.length - (5 + Index)
                )}+\` Tracks are Present in Queue`
            )
        }
        const ReturnEmbed = {
            title: 'Current Queue Stats',
            description: `__**Current ${Index + 1}/${
                Queue.tracks.length
            } Tracks Data**__\n\n${StringArrays.join('\n')}`,
            field: {
                title: `Queue Progress Bar`,
                value: Queue.createProgressBar('queue'),
            },
        }
        return void (await interaction.editReply({ embeds: [ReturnEmbed] }))
    },
}
