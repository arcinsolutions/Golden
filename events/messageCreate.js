const { sendTimed } = require('../functions/channel')

const { MessageEmbed } = require('discord.js')
const { getPreview, getTracks } = require('spotify-url-info')

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        if (
            client.db.has(message.guild.id) &&
            message.channel.id === client.db.get(message.guild.id).channel
        ) {
            if (message.author.bot) return // Cancel, if the bot is the author

            message.delete().catch() // User wrote message inside music channel..

            if (!message.member.voice.channel)
                return sendTimed(
                    message.channel,
                    {
                        embeds: [
                            embed
                                .setDescription(
                                    `**❌ | <@${message.member.id}> You have to join a voice channel first**`
                                )
                                .setColor('DARK_RED'),
                        ],
                    },
                    5
                )

            const guildId = message.guild.id
            let request = message.content

            const Queue =
                client.player.GetQueue(guildId) ??
                client.player.CreateQueue(message)

            let success = true

            if (await !request.includes('https')) {
                request += ' topic'
                success = await this.requestPlay(Queue, request, message)
            }

            if (await request.includes('spotify')) {
                if (await request.includes('track')) {
                    const track = await getPreview(request)
                    request = `${track.title} by ${track.artist}`
                    success = await this.requestPlay(Queue, request, message)
                } else {
                    const tracks = await getTracks(request)
                    tracks.forEach(async (song) => {
                        const track = await getPreview(
                            song.external_urls.spotify
                        )
                        request = `${track.title} by ${track.artist}`
                        success = await this.requestPlay(
                            Queue,
                            request,
                            message
                        )
                        if (!success) return
                    })
                }
            } else {
                success = await this.requestPlay(Queue, request, message)
            }

            if (success) {
                return
            } else {
                return sendTimed(
                    message.channel,
                    {
                        embeds: [
                            embed
                                .setDescription(
                                    `**❌ | Song/s can't be played. Please try again**`
                                )
                                .setColor('DARK_RED'),
                        ],
                    },
                    5
                )
            }
        }
    },

    requestPlay: async function (Queue, song, message) {
        return Queue.play(song, message.member.voice.channel, message.member)
    },
}
