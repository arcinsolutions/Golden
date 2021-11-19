const {
    goldenChannelExistsInGuild,
    deleteGoldenChannelInsideGuild,
    createGoldenChannelInsideGuild,
    populateGoldenChannelInsideGuild,
    sendTimed,
} = require('../functions/channel')

const { MessageEmbed } = require('discord.js')
//const { QueryType } = require('discord-player')
const playdl = require('play-dl')

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (
            client.db.has(message.guild.id) &&
            message.channel.id === client.db.get(message.guild.id).channel
        ) {
            if (message.author.bot) return // Cancel, if the bot is the author

            message.delete().catch() // User wrote message inside music channel..

            const guildId = message.guild.id
            let request = message.content

            if(!request.includes('https'))
                request += ' topic'
                //request += ' music lyric'

            const Queue =
                client.player.GetQueue(guildId) ??
                client.player.CreateQueue(message)

            const success = await Queue.play(
                request,
                message.member.voice.channel,
                message.member
            )

            if (success) {
                return
                /*const ReturnEmbed = {
                title: 'Searching for this song..',
            }
            return void (await message.channel.send({ embeds: [ReturnEmbed] }))*/
            }

            const ErrorEmbed = {
                title: "Songs can't be played. Please try again",
            }
            return void (await message.channel.send({ embeds: [ErrorEmbed] }))

            /*const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

            // If author isn't in a voice channel
            if (!message.member.voice.channel) return sendTimed(message.channel, {
                embeds: [
                    embed
                        .setDescription(
                            `**❌ | You have to join a voice channel first**`
                        )
                        .setColor('DARK_RED'),
                ],
            }, 5)

            const guild = message.guild.id
            const channel = message.guild.channels.cache.get(
                message.channel.id
            )

            const request = message.content
            const searchResult = await client.player.search(request, {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO,
            })

            if (!searchResult || !searchResult.tracks.length) {
                sendTimed(message.channel, {
                    embeds: [
                        embed
                            .setDescription(`**❌ | No results were found!**`)
                            .setColor('DARK_RED'),
                    ],
                }, 5)
            }

            const queue = await client.player.createQueue(guild, {
                // Temoraly disabled, bot will not delete the Queue after Kick!!!
                //leaveOnEnd: false,
                //leaveOnStop: false,
                //leaveOnEmpty: true,
                //eaveOnEmptyCooldown: 5000,
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
                                    .then((x) => { 
                                        x[0].url
                                        track.thumbnail = x[0].thumbnail
                                    })
                            )
                        ).stream
                    }
                },
            })

            const member =
            message.guild.members.cache.get(message.author.id) ??
            (await guild.members.fetch(message.author.id))

            // Check again, since user might have left the channel
            if (!message.member.voice.channel) return sendTimed(message.channel, {
                embeds: [
                    embed
                        .setDescription(
                            `**❌ | You have to join a voice channel first**`
                        )
                        .setColor('DARK_RED'),
                ],
            }, 5)

        try {
            if (!queue.connection) await queue.connect(member.voice.channel)
        } catch (e) {
            client.player.deleteQueue(message.guild.id)
            console.log(e)
            return sendTimed(message.channel, {
                embeds: [
                    embed
                        .setDescription(
                            `**❌ | An error occured, please check bots console and try again**`
                        )
                        .setColor('DARK_RED'),
                ],
            }, 5)
        }

        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0])
        if (!queue.playing) await queue.play()

        }*/
        }
    },
}
