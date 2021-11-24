const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('let you see the current Queue')
        .addStringOption((option) =>
            option
                .setName('page')
                .setDescription('the Queue Page')
                .setRequired(false)
        ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const embed = new MessageEmbed()
            .setTitle('Queue:')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        var page = interaction.options.getString('page')

        const queue = client.player.getQueue(interaction.guild.id)

        if (!queue || !queue.playing)
            return void interaction.editReply({
                embeds: [
                    embed.setDescription('**❌ | No music is being played!**').setColor('DARK_RED'),
                ],
            })
        if (!page) page = 1
        const pageStart = 10 * (page - 1)
        const pageEnd = pageStart + 10
        const currentTrack = queue.current
        const tracks = queue.tracks.slice(pageStart, pageEnd).map((song, i) => {
            return `\`${i + pageStart + 1}.\` ** | [${song.title} by ${
                song.author
            }](${song.url})**`
        })

        return void interaction.editReply({
            embeds: [
                embed
                    .setDescription(
                        `**🎶 | Now Playing: [${currentTrack.title} by ${
                            currentTrack.author
                        }](${currentTrack.url})**\n\n${tracks.join('\n')}${
                            queue.tracks.length > pageEnd
                                ? `\nand... \`${
                                      queue.tracks.length - pageEnd
                                  }\` more track(s)`
                                : ''
                        }`
                    ).setColor('DARK_GREEN')
            ],
        })
    },
}
