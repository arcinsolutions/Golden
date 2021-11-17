/** ++ Discord init ++ **/
const { Client, Collection, Intents, MessageEmbed } = require('discord.js')
const fs = require('fs')
var colors = require('colors/safe')

const {
    setGoldenChannelPlayerThumbnail,
    setGoldenChannerlPlayerTitle,
    setGoldenChannerlPlayerQueue,
    setGoldenChannelPlayerFooter,
    resetGoldenChannelPlayer,
    sendTimed,
} = require('./functions/channel')

require('dotenv').config({ path: './config/.env' })

const client = new Client({
    fetchAllMembers: true,
    // restTimeOffset: 0,
    // restWsBridgetimeout: 100,
    shards: 'auto',
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        // Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        // Intents.FLAGS.GUILD_WEBHOOKS,
        // Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
    ],
})

/** ++ Music init ++ */
const { Player } = require('discord-player')

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highest',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
    },
})
/** -- Music init -- */

/** ++ Command Handler ++ */

// with subfolder
client.commands = new Collection()
client.categories = require('fs').readdirSync(`./commands`)
var commandFiles = ''

fs.readdirSync('./commands/').forEach((dir) => {
    commandFiles = fs
        .readdirSync(`./commands/${dir}/`)
        .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`)

        if (!command.category) {
            console.log(
                colors.red.bold(
                    '❌ | No Category found in ' + command.data.name
                )
            )
            process.exit()
        }

        client.commands.set(command.data.name, command)
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    const ErrorEmbed = new MessageEmbed().setTimestamp().setColor('DARK_RED')

    const command = client.commands.get(interaction.commandName)

    if (!command)
        return interaction.editReply({
            embeds: [
                ErrorEmbed.setDescription(
                    '**❌ | please submit a Valid command!**'
                ),
            ],
        })

    try {
        await command.execute(interaction, client)
    } catch (error) {
        console.error(error)
        await interaction.editReply({
            embeds: [
                ErrorEmbed.setDescription(
                    '**❌ | There was an error while executing this command!**'
                ),
            ],
            ephemeral: true,
        })
    }
})

client.on('error', console.error)
client.on('warn', console.warn)

/** -- Command Handler -- */

/** ++ Quick DB ++ */

client.db = require('quick.db')

/** -- Quick DB -- */

/** ++ Event Handler ++ */

var eventFiles

eventFiles = fs.readdirSync(`./events/`).filter((file) => file.endsWith('.js'))
for (const file of eventFiles) {
    const event = require(`./events/${file}`)

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}

/** -- Event Handler -- */
/** -- Discord init -- **/

/** ++ Start ++ **/

const imgText = `
 ██████╗  ██████╗ ██╗     ██████╗ ███████╗███╗   ██╗ 
██╔════╝ ██╔═══██╗██║     ██╔══██╗██╔════╝████╗  ██║ 
██║  ███╗██║   ██║██║     ██║  ██║█████╗  ██╔██╗ ██║ 
██║   ██║██║   ██║██║     ██║  ██║██╔══╝  ██║╚██╗██║ 
╚██████╔╝╚██████╔╝███████╗██████╔╝███████╗██║ ╚████║ 
 ╚═════╝  ╚═════╝ ╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═══╝     v1.0
         ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗
         ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗
         ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝
         ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗
         ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║
         ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
         `

console.log(colors.red(imgText))

client.login(process.env.TOKEN)

/** -- Start -- **/

/** ++ Music events ++ */
client.player.on('error', (queue, error) => {
    console.log(
        `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
    )
})
client.player.on('connectionError', (queue, error) => {
    console.log(
        `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
    )
})

client.player.on('trackStart', (queue, track) => {
    const embed = new MessageEmbed().setTimestamp()

    //https://www.reddit.com/r/Discord_Bots/comments/jel7r5/get_guild_by_id_in_discordjs/
    /*console.log(track)
    console.log(track.thumbnail)*/

    setGoldenChannerlPlayerTitle(
        queue.guild,
        client,
        `🎶 | Now Playing\n${track.title} by ${track.author}`
    )
    setGoldenChannelPlayerThumbnail(queue.guild, track.thumbnail)
    setGoldenChannelPlayerFooter(
        queue.guild,
        `${queue.tracks.length} songs in queue | Volume: ${queue.volume}%`
    )

    if (queue.tracks[0] == undefined) {
        setGoldenChannerlPlayerQueue(
            queue.guild,
            'Join a voice channel and queue songs by name or url in here.'
        )
    } else {
        const tracks = queue.tracks
            .slice(0)
            .reverse()
            .map((song, i) => {
                if (queue.current.id != queue.tracks[0].id) {
                    return `\`${queue.tracks.length - i}.\` ${song.title} - ${
                        song.author
                    } [${song.duration}]\n`
                }
            })
        setGoldenChannerlPlayerQueue(queue.guild, tracks.join(''))

        sendTimed(queue.metadata, {
            embeds: [
                embed
                    .setDescription(
                        `**🎶 | Track **[${track.title} by ${track.author}](${track.url})** queued!**`
                    )
                    .setURL(track.url)
                    .setThumbnail(track.thumbnail)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setColor('DARK_ORANGE'),
            ],
        }, 5)
    }

    if (
        !client.db.has(queue.guild.id) &&
        queue.metadata.id != client.db.get(queue.guild.id).channel
    ) {
        queue.metadata.send({
            embeds: [
                embed
                    .setDescription(
                        `**🎶 | Now Playing\n[${track.title} by ${track.author}](${track.url})**`
                    )
                    .addField('Duration', `${track.duration} min.`, true)
                    .addField('Views', `${track.views}`, true)
                    .setImage(track.thumbnail)
                    .setFooter(
                        client.user.username,
                        client.user.displayAvatarURL()
                    )
                    .setColor('DARK_GREEN'),
            ],
        })
    }
})

client.player.on('trackAdd', (queue, track) => {
    const embed = new MessageEmbed().setTimestamp()

    // Request inside the music channel
    if (client.db.has(queue.guild.id) && queue.metadata.id === client.db.get(queue.guild.id).channel) {

        if(queue.tracks[0] === undefined) {
            setGoldenChannerlPlayerQueue(queue.guild, 'Join a voice channel and queue songs by name or url in here.')

        } else {

            const tracks = queue.tracks.slice(0).reverse().map((song, i) => {
                if(queue.current.id != queue.tracks[0].id) {
                    return `${queue.tracks.length - i}. ${song.title} - ${song.author} [${song.duration}]\n`
                }
            })
            setGoldenChannerlPlayerQueue(queue.guild, tracks.join(''))
        }

    // Request via command /play
    } else {
        queue.metadata.send({
            embeds: [
                embed
                    .setDescription(
                        `**🎶 | Track **[${track.title} by ${track.author}](${track.url})** queued!**`
                    )
                    .setURL(track.url)
                    .setThumbnail(track.thumbnail)
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setColor('DARK_ORANGE'),
            ],
        })
    }
})

client.player.on('queueEnd', (queue) => {
    resetGoldenChannelPlayer(queue.guild)
})

client.player.on('botDisconnect', (queue) => {
    try {
        const embed = new MessageEmbed().setTimestamp()

        queue.metadata.send({
            embeds: [
                embed
                    .setDescription(
                        '**❌ | I was manually disconnected from the voice channel, clearing queue!**'
                    )
                    .setFooter(
                        client.user.username,
                        client.user.displayAvatarURL()
                    )
                    .setColor('DARK_RED'),
            ],
        })
    } catch (e) {
        console.log(e)
    }

    queue.destroy()
})

// Disabled cause bot wont leave when empty!
// client.player.on('channelEmpty', (queue) => {
//     queue.metadata.send({
//         embeds: [
//             embed
//                 .setDescription(
//                     '❌ | Nobody is in the voice channel, leaving...'
//                 )
//                 .setImage('')
//                 .setThumbnail('')
//                 .setFooter(client.user.username, client.user.displayAvatarURL())
//                 .setColor('DARK_RED'),
//         ],
//     })
// })

// Disabled cause bot wont leave when queue finished
// client.player.on('queueEnd', (queue) => {
//     queue.metadata.send({
//         embeds: [
//             embed
//                 .setAuthor('')
//                 .setDescription(`✅ | Queue finished!`)
//                 .setImage('')
//                 .setThumbnail('')
//                 .setFooter(client.user.username, client.user.displayAvatarURL())
//                 .setColor('DARK_GREEN'),
//         ],
//     })
// })

/** -- Music events */
