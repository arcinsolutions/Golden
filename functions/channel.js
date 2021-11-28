const { bold } = require('colors/safe')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    createGoldenChannelInsideGuild: async function (guild) {
        const goldenChannel = await guild.channels.create(
            'golden-song-requests',
            {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
            }
        )

        await db.set(guild.id, { channel: goldenChannel.id })
        return goldenChannel
    },

    /* * * * * * * * * * * */

    populateGoldenChannelPlayerInsideGuild: async function (guild, client) {
        const queue = client.player.GetQueue(guild.id)

        if (queue !== undefined && queue.current !== undefined) {
            module.exports.setGoldenChannelPlayerThumbnail(
                guild,
                queue.current.thumbnail
            )
            module.exports.setGoldenChannerlPlayerTitle(
                guild,
                `🎶 | Now Playing:\n${queue.current.title} by ${queue.current.channelId}`
            )
            module.exports.setGoldenChannelPlayerFooter(
                guild,
                queue.tracks.length - 1,
                queue.volume
            )

            let tracksMap = ''

            queue.tracks.forEach((track, i) => {
                if (i != 0)
                    tracksMap =
                        `${i}. ${track.title} by ${track.channelId}\n` +
                        tracksMap
            })

            module.exports.setGoldenChannerlPlayerQueue(guild, tracksMap)
        }
    },

    /* * * * * * * * * * * */

    populateGoldenChannelInsideGuild: async function (guild) {
        const goldenChannelId = await db.get(guild.id).channel
        const goldenChannel = await guild.channels.cache.get(goldenChannelId)

        /*       */

        const goldenChannelControlComponents = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('playpause')
                    .setEmoji('⏯')
                    .setStyle('SECONDARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('stop')
                    .setEmoji('⏹')
                    .setStyle('SECONDARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('skip')
                    .setEmoji('⏭')
                    .setStyle('SECONDARY')
            )

        const goldenChannelEmbed = new MessageEmbed()
            .setColor('DARK_BUT_NOT_BLACK')
            .setTitle('🎶 | no Song is being Played')
            .setDescription(
                '[Bot Invite](https://example.com) | [Dashboard](https://www.golden.spasten.studio) | [Commands](https://example.com) | [Support](https://discord.gg/PX28nyVgdP)'
            )
            .setImage(
                'https://cdn.discordapp.com/attachments/911271717492621343/912002185267646544/bg4.png'
            )
            .setFooter(`0 songs in queue | Volume: 95%`)

        const goldenBanner = await goldenChannel.send(
            'https://cdn.discordapp.com/attachments/911271717492621343/914553180883406898/bg2v3.png'
        )
        const goldenMessage = await goldenChannel.send({
            content:
                'ㅤ\n__**Queue:**__\nJoin a Voice Channel and add a Song or a Playlist',
            embeds: [goldenChannelEmbed],
            components: [goldenChannelControlComponents],
        })

        await db.set(guild.id, {
            channel: goldenChannel.id,
            banner: goldenBanner.id,
            request: goldenMessage.id,
        }) //Note: overwriting existing channel parameter, that was already set inside createChannel() function!
    },

    /* * * * * * * * * * * */

    deleteGoldenChannelInsideGuild: async function (guild) {
        const goldenChannelId = await db.get(guild.id).channel
        const goldenChannel = await guild.channels.cache.get(goldenChannelId)

        return goldenChannel.delete()
    },

    /* * * * * * * * * * * */

    goldenChannelExistsInGuild: function (guild) {
        return (
            db.has(guild.id) &&
            guild.channels.cache.get(db.get(guild.id).channel) !== undefined
        )
    },

    /* * * * * * * * * * * */

    isGoldenChannel: function (guild, channel) {
        // Make sure that goldenChannelExistsInGuild() was called before this one
        return (
            guild.channels.cache.get(db.get(guild.id).channel).id === channel.id
        )
    },

    /* * * * * * * * * * * */

    goldenPlayerExistsInGuild: async function (guild, client) {
        if (db.has(guild.id)) {
            const cachedChannel = client.channels.cache.get(
                db.get(guild.id).channel
            )

            try {
                await cachedChannel.messages.fetch(db.get(guild.id).request)
                return true
            } catch (e) {
                return false
            }
        }

        return false
    },

    /* * * * * * * * * * * */

    setGoldenChannelPlayerThumbnail: async function (guild, imageUrl) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            goldenChannelPlayerMessage.embeds[0].image.url = imageUrl

            goldenChannelPlayerMessage.edit({
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    setGoldenChannerlPlayerQueue: async function (guild, queue) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            if (queue == '') {
                queue = 'Join a Voice Channel and add a Song or a Playlist'
            }

            goldenChannelPlayerMessage.edit({
                //content: "ㅤ\n__Queue list:__\n1. KA SO NEN SONG"
                content: `ㅤ\n**__Queue:__**\n${queue}`,
            })
        }
    },

    /* * * * * * * * * * * */

    setGoldenChannerlPlayerTitle: async function (guild, title) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            goldenChannelPlayerMessage.embeds[0].author = {
                name: title,
            }
            goldenChannelPlayerMessage.embeds[0].title = ''
            goldenChannelPlayerMessage.embeds[0].description =
                '[Bot Invite](https://example.com) | [Dashboard](https://www.golden.spasten.studio) | [Commands](https://example.com) | [Support](https://discord.gg/PX28nyVgdP)'

            goldenChannelPlayerMessage.edit({
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    resetGoldenChannelPlayer: async function (guild, volume) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            goldenChannelPlayerMessage.embeds[0].author = {}
            goldenChannelPlayerMessage.embeds[0].title =
                '🎶 | no Song is being Played'
            goldenChannelPlayerMessage.embeds[0].description =
                '[Invite](https://www.spasten.studio/) | [Dashboard](https://www.spasten.studio/) | [Commands](https://www.spasten.studio/) | [Support](https://discord.gg/PX28nyVgdP)'
            goldenChannelPlayerMessage.embeds[0].image = {
                url: 'https://cdn.discordapp.com/attachments/911271717492621343/912002185267646544/bg4.png',
            }

            if (volume === undefined) volume = 95
            goldenChannelPlayerMessage.embeds[0].footer = {
                text: `0 songs in queue | Volume: ${volume}%`,
            }

            goldenChannelPlayerMessage.edit({
                content:
                    'ㅤ\n__**Queue:**__\nJoin a Voice Channel and add a Song or a Playlist',
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    setGoldenChannelPlayerFooter: async function (guild, songs, volume) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            //goldenChannelPlayerMessage.embeds[0].footer = { text: "0 songs in queu | Volume: 100%" }

            if (volume === undefined) volume = 95

            if (songs === undefined) songs = 0

            goldenChannelPlayerMessage.embeds[0].footer = {
                text: `${songs} songs in queue | Volume: ${volume}%`,
            }

            goldenChannelPlayerMessage.edit({
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    sendTimed: function (channel, text, duration = 10) {
        channel.send(text).then((message) => {
            if (duration === -1) {
                return
            }

            setTimeout(() => {
                message.delete().catch()
            }, 1000 * duration)
        })
    },

    /* * * * * * * * * * * */
}
