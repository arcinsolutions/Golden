/** ++ Discord init ++ **/
const { Client, Collection, Intents } = require('discord.js')
const fs = require('fs')

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
    Intents.FLAGS.GUILD_MESSAGE_TYPING
  ]
})

/** ++ Command Handler ++ */

client.commands = new Collection()
client.categories = require('fs').readdirSync(`./commands`)
var commandFiles = ''

fs.readdirSync('./commands/').forEach(dir => {
  commandFiles = fs
    .readdirSync(`./commands/${dir}/`)
    .filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`)

    client.commands.set(command.data.name, command)
  }
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return interaction.reply('please submit a Valid command!')

  try {
    await command.execute(interaction, client)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    })
  }
})

/** -- Command Handler -- */

/** ++ Event Handler ++ */

var eventFiles

eventFiles = fs.readdirSync(`./events/`).filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
  const event = require(`./events/${file}`)

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

/** -- Event Handler -- */
/** -- Discord init -- **/

/** ++ Start ++ **/

var colors = require('colors/safe')

const imgText = `
 ██████╗  ██████╗ ██╗     ██████╗ ███████╗███╗   ██╗ 
██╔════╝ ██╔═══██╗██║     ██╔══██╗██╔════╝████╗  ██║ 
██║  ███╗██║   ██║██║     ██║  ██║█████╗  ██╔██╗ ██║ 
██║   ██║██║   ██║██║     ██║  ██║██╔══╝  ██║╚██╗██║ 
╚██████╔╝╚██████╔╝███████╗██████╔╝███████╗██║ ╚████║ 
 ╚═════╝  ╚═════╝ ╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═══╝     v0.75
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
