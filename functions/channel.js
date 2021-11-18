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
            .setTitle('no Song is being Played')
            .setDescription(
                '[Bot Invite](https://example.com) | [Dashboard](https://www.golden.spasten.studio) | [Commands](https://example.com) | [Support](https://discord.gg/PX28nyVgdP)'
            )
            .setImage('https://cdn.hydra.bot/hydra_no_music.png')
        /*       */

        const goldenBanner = await goldenChannel.send(
            'https://cdn.discordapp.com/attachments/888129386124038174/888129397293461574/hydra_banner.png'
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

    goldenPlayerExistsInGuild: async function (guild, client) {
        if(db.has(guild.id)) {
            const cachedChannel = client.channels.cache.get(db.get(guild.id).channel)
            
            try {
                await cachedChannel.messages.fetch(db.get(guild.id).request)
                return true;

            } catch (e) {
                return false;
            }
            
       
        }

        return false;
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

            goldenChannelPlayerMessage.edit({
                //content: "ㅤ\n__Queue list:__\n1. KA SO NEN SONG"
                content: `ㅤ\n**__Queue:__**\n${queue}`,
            })
        }
    },

    /* * * * * * * * * * * */

    setGoldenChannerlPlayerTitle: async function (guild, client, title) {
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
            goldenChannelPlayerMessage.embeds[0].description = ''

            goldenChannelPlayerMessage.edit({
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    resetGoldenChannelPlayer: async function (guild) {
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
                'no Song is being Played'
            goldenChannelPlayerMessage.embeds[0].description =
                '[Invite](https://example.com) | [Dashboard](https://example.com) | [Commands](https://example.com) | [Support](https://example.com)'
            goldenChannelPlayerMessage.embeds[0].image.url =
                'https://cdn.hydra.bot/hydra_no_music.png'

            goldenChannelPlayerMessage.embeds[0].footer = { text: `0 songs in queue | Volume: 95%` } // TODO: Volume..

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

    setGoldenChannelPlayerFooter: async function (guild, footer) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            //goldenChannelPlayerMessage.embeds[0].footer = { text: "0 songs in queu | Volume: 100%" }
            goldenChannelPlayerMessage.embeds[0].footer = { text: footer }

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
