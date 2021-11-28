const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('let you see the current Queue')
        .addIntegerOption((option) =>
            option
                .setName('page')
                .setDescription('the Page of the Queue, you want to see')
                .setRequired(false)
        ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const embed = new MessageEmbed()
            .setTitle('**🎶 | Queue:**')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        const guildId = interaction.guild.id
        let page = interaction.options.getInteger('page')
        const queue = client.player.GetQueue(guildId)
        const currentTrack = queue.current

        if (!queue || !queue.playing)
            return void interaction.editReply({
                embeds: [
                    embed
                        .setDescription('**❌ | No music is being played!**')
                        .setColor('DARK_RED'),
                ],
            })

        if (page == null) page = 1
        const pageStart = 10 * (page - 1)
        const pageEnd = pageStart + 10
        const tracks = queue.tracks
            .slice(pageStart, pageEnd)
            .map((track, i) => {
                let pos = i + pageStart + 1
                if (pos == 1)
                    return `\`Now Playing.\` ** | [${track.title} by ${track.channelId}](${track.url})**`
                else
                    return `\`${i + pageStart + 0}.\` ** | [${track.title} by ${
                        track.channelId
                    }](${track.url})**`

            })

        return interaction.editReply({
            embeds: [
                embed
                    .setDescription(
                        `${tracks.join('\n')}${
                            queue.tracks.length > pageEnd
                                ? `\nand... \`${
                                      queue.tracks.length - pageEnd
                                  }\` more track(s)`
                                : ''
                        }`
                    )
                    .setColor('DARK_GREEN'),
            ],
        })
    },
}
