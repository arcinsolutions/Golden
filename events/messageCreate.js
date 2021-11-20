const {
    goldenChannelExistsInGuild,
    deleteGoldenChannelInsideGuild,
    createGoldenChannelInsideGuild,
    populateGoldenChannelInsideGuild,
    sendTimed,
} = require('../functions/channel')

const { MessageEmbed } = require('discord.js')

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

            if (!request.includes('https')) request += ' topic'
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
    },
}
