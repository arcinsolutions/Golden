const { MessageEmbed, ReactionUserManager } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')
const { isGoldenChannel, sendTimed } = require('../functions/channel')

module.exports = {
    skip: async function (interaction, client, skipAmount) {
        const guild = interaction.guild
        const channel = interaction.channel

        if(getVoiceConnection(guild.id) === undefined) {
            return; // golden not in a voice channel rn - do nothing
        } else if(getVoiceConnection(guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
            const ReturnEmbed = {
                title: 'Join My Channel',
                description:
                    "Please join my voice channel to use this interaction",
            }
            
            return void (await sendTimed(channel, { embeds: [ReturnEmbed] }, 5))
        }

        const Queue = client.player.GetQueue(guild.id)
        if (!Queue || (Queue && !Queue.tracks[1])) {
            const ErrorEmbed = {
                title: 'Empty Queue',
                description:
                    "No Songs are playing in `Queue`\nOR, Next Track is not Present in Queue\nSongs can't be `Skipped`",
            }

            if (isGoldenChannel(guild, channel))
                return void (await interaction.channel.send({
                    embeds: [ErrorEmbed],
                }))

            return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }
        const success = Queue.skip(skipAmount ?? undefined)
        if (success && !isGoldenChannel(guild, channel)) {
            const ReturnEmbed = {
                title: 'Songs has been Skipped',
            }
            return void (await interaction.editReply({ embeds: [ReturnEmbed] }))
        } else if (success) {
            // Song skipped successfully inside the golden channel - no message to send!
            return
        }

        const ErrorEmbed = {
            title: "Songs can't be Skipped",
        }

        if (isGoldenChannel(guild, channel))
            return void (await interaction.channel.send({
                emebds: [ErrorEmbed],
            }))

        return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
    },

    stop: async function (interaction, client) {
        const guild = interaction.guild
        const channel = interaction.channel
        
        if(getVoiceConnection(guild.id) === undefined) {
            return; // golden not in a voice channel rn - do nothing
        } else if(getVoiceConnection(guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
            const ReturnEmbed = {
                title: 'Join My Channel',
                description:
                    "Please join my voice channel to use this interaction",
            }
            
            return void (await sendTimed(channel, { embeds: [ReturnEmbed] }, 5))
        }

        const Queue = client.player.GetQueue(guild.id)
        if (!Queue || (Queue && !Queue.current)) {
            const ErrorEmbed = {
                title: 'Empty Queue',
                description:
                    "No Songs are playing in `Queue`\nSongs can't be `Stopped`",
            }

            if (isGoldenChannel(guild, channel))
                return void (await interaction.channel.send({
                    embeds: [ErrorEmbed],
                }))

            return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }

        Queue.stop()

        // const success = await Queue.stop()
        // if (success && !isGoldenChannel(guild, channel)) {
        //     const ReturnEmbed = {
        //         title: 'Songs has been Stopped',
        //     }
        //     return void (await interaction.editReply({ embeds: [ReturnEmbed] }))
        // } else if (success) {
        //     // console.log(client.player.DeleteQueue(guild.id))
        // //    console.log(await Queue.clear())
        //     // Queue got successfully stopped inside the golden channel - no message to send!
        //    // console.log("1: " + Queue.delete());
        //     return
        // }
        const ErrorEmbed = {
            title: "Songs can't be Stopped",
        }

        if (isGoldenChannel(guild, channel))
            return void (await interaction.channel.send({
                embeds: [ErrorEmbed],
            }))

        return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
    },

    playpause: async function (interaction, client) {
        const guild = interaction.guild
        const channel = interaction.channel

        if(getVoiceConnection(guild.id) === undefined) {
            return; // golden not in a voice channel rn - do nothing
        } else if(getVoiceConnection(guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
            const ReturnEmbed = {
                title: 'Join My Channel',
                description:
                    "Please join my voice channel to use this interaction",
            }
            
            return void (await sendTimed(channel, { embeds: [ReturnEmbed] }, 5))
        }

        const Queue = client.player.GetQueue(guild.id)
        if (!Queue || (Queue && !Queue.tracks[0])) {
            const ErrorEmbed = {
                title: 'Empty Queue',
                description:
                    "No Songs are playing in `Queue`\nOR, Next Track is not Present in Queue\nSongs can't be `Resumed/Un-Paused`",
            }

            if (isGoldenChannel(guild, channel))
                return void (await interaction.channel.send({
                    embeds: [ErrorEmbed],
                }))

            return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }

        if (Queue.paused) {
            const success = Queue.resume()
            if (success && !isGoldenChannel(guild, channel)) {
                const ReturnEmbed = {
                    title: 'Songs has been Resumed/Un-Paused',
                }
                return void (await interaction.editReply({
                    embeds: [ReturnEmbed],
                }))
            } else if (success) {
                // Success inside golden channel - no return needed
                return
            }
            const ErrorEmbed = {
                title: "Songs can't be Resumed/Un-Paused",
            }
            return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
        } else {
            const success = Queue.pause()
            if (success && !isGoldenChannel(guild, channel)) {
                const ReturnEmbed = {
                    title: 'Songs has been Paused',
                }
                return void (await interaction.editReply({
                    embeds: [ReturnEmbed],
                }))
            } else if (success) {
                // Success in golden channel - no return message needed
                return
            }
            const ErrorEmbed = {
                title: "Songs can't be Paused",
            }
            return void (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }
    },
}
