const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { QueryType } = require('discord-player')
const path = require('path')
const playdl = require('play-dl')

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

        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        const guild = interaction.guild.id
        const channel = interaction.guild.channels.cache.get(
            interaction.channel.id
        )
        const request = interaction.options.getString('song')
        const searchResult = await client.player.search(request, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        })

        if (!searchResult || !searchResult.tracks.length)
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`**❌ | No results were found!**`)
                        .setColor('DARK_RED'),
                ],
            })

        const queue = await client.player.createQueue(guild, {
            leaveOnEnd: false,
            leaveOnStop: false,
            leaveOnEmpty: false,
            metadata: channel,
            async onBeforeCreateStream(track, source, queue) {
                if (track.url.includes('youtube.com')) {
                    // play directly if it's a youtube track
                    return (await playdl.stream(track.url)).stream
                } else {
                    // search for the track on youtube with the track author & title using playdl.search()
                    // i added "lyric" to the search query to avoid playing music video streams
                    return (
                        await playdl.stream(
                            await playdl
                                .search(
                                    `${track.author} ${track.title} lyric`,
                                    { limit: 1, source: { youtube: 'video' } }
                                )
                                .then((x) => x[0].url)
                        )
                    ).stream
                }
            },
        })

        const member =
            interaction.guild.members.cache.get(interaction.user.id) ??
            (await guild.members.fetch(interaction.user.id))
        try {
            if (!queue.connection) await queue.connect(member.voice.channel)
        } catch {
            client.player.deleteQueue(interaction.guild.id)
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(
                            `**❌ | Could not join your voice channel!**`
                        )
                        .setColor('DARK_RED'),
                ],
            })
        }

        await interaction.editReply({
            embeds: [
                embed
                    .setDescription(
                        `**⏱ | Adding requested ${
                            searchResult.playlist ? 'playlist' : 'track'
                        }...**`
                    )
                    .setColor('DARK_GOLD'),
            ],
        })

        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0])
        if (!queue.playing) await queue.play()
    },
}
