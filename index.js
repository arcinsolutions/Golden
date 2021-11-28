/** ++ Discord init ++ **/
const { Client, Collection, Intents, MessageEmbed } = require('discord.js')
const fs = require('fs')
var colors = require('colors/safe')

require('dotenv').config({ path: './config/.env' })

const client = new Client({
    fetchAllMembers: true,
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

const { Player } = require('jericho-player')
// TODO: If bots starts disconnect all instances that are still connected !
client.player = new Player(client, {
    LeaveOnEnd: false,
    LeaveOnEmpty: false,
    LeaveOnBotEmpty: false,
    LeaveOnEndTimedout: 300,
    LeaveOnEmptyTimedout: 300,
    LeaveOnBotOnlyTimedout: 300,
}) // 300s = 3min

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

/** -- Music Event Handler -- */

const playerEvents = fs
  .readdirSync('./events/music')
  .filter((file) => file.endsWith('.js'))

for (const PlayerEventsFile of playerEvents) {
  const event = require(`./events/music/${PlayerEventsFile}`)
  client.player.on(PlayerEventsFile.split('.')[0], event.bind(null, client))
}

/** -- Music Event Handler -- */

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