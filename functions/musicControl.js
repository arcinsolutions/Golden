const { MessageEmbed } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice');
const { sendTimed } = require('../functions/channel')
const { resetGoldenChannelPlayer } = require('../functions/channel')

module.exports = {
    skip: function (interaction, client) {
        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        const guild = interaction.guild;

        if(getVoiceConnection(interaction.guild.id) !== undefined && getVoiceConnection(interaction.guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
            return sendTimed(interaction.channel, {
                embeds: [
                    embed
                        .setDescription(`**❌ | ${interaction.member}, please join my channel to skip songs!**`)
                        .setColor('DARK_RED'),
                ],
            }, 5)
        }

        
        /*
        if(client.voice.connections.some((connection) => connection.channel.id === interaction.member.voice.channelID)) {
            console.log("SAME CHANNEL")
        } else {
            console.log("NOT SAME CHANNEL!")
        }*/

        const queue = client.player.getQueue(guild.id)
        if (!queue || !queue.playing)
            return sendTimed(interaction.channel, {
                embeds: [
                    embed
                        .setDescription(`**❌ | ${interaction.member}, no music is being played!**`)
                        .setColor('DARK_RED'),
                ],
            }, 5)    

        const track = queue.current
        queue.setPaused(false)
        const success = queue.skip()
        /*return void interaction.channel.send({
            embeds: [
                embed
                    .setDescription(
                        success
                            ? `**✅ | Skipped [${track.title} by ${track.author}](${track.url})!**`
                            : '**❌ | Something went wrong!**'
                    )
                    .setColor('DARK_GOLD'),
            ],
        })*/
    },

    stop: async function (interaction, client) {
        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

            if(getVoiceConnection(interaction.guild.id) !== undefined && getVoiceConnection(interaction.guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
                return sendTimed(interaction.channel, {
                    embeds: [
                        embed
                            .setDescription(`**❌ | ${interaction.member}, please join my channel to cancel my queue songs!**`)
                            .setColor('DARK_RED'),
                    ],
                }, 5)
            }

        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.playing)
            return void interaction.channel.send({
                embeds: [
                    embed
                        .setDescription('**❌ | There is no queue to cancel!**')
                        .setColor('DARK_RED'),
                ],
            })
            
        queue.clear()
        queue.stop()
        resetGoldenChannelPlayer(interaction.guild)
    },

    playpause: async function(interaction, client) {

        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

            if(getVoiceConnection(interaction.guild.id) !== undefined && getVoiceConnection(interaction.guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
                return sendTimed(interaction.channel, {
                    embeds: [
                        embed
                            .setDescription(`**❌ | ${interaction.member}, please join my channel to pause and play songs!**`)
                            .setColor('DARK_RED'),
                    ],
                }, 5)
            }

        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.playing)
            return void interaction.channel.send({
                embeds: [
                    embed
                        .setDescription('**❌ | There is no music to play or pause!**')
                        .setColor('DARK_RED'),
                ],
            })

        if(queue.connection.paused) {
            queue.setPaused(false)
        } else {
            queue.setPaused(true)
        }

        /*return void interaction.channel.send({
            embeds: [
                embed
                    .setDescription(paused ? '⏸ | Paused!' : '**❌ | Something went wrong!**')
                    .setColor(paused ? 'DARK_GREEN' : 'DARK_RED'),
            ],
        })*/

    },
}
