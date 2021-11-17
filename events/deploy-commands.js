const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')
var colors = require('colors/safe')

const commands = []

fs.readdirSync('./commands/').forEach(dir => {
  const commandFiles = fs
    .readdirSync(`./commands/${dir}/`)
    .filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`../commands/${dir}/${file}`)

    commands.push(command.data.toJSON())
  }
})

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    //Global
    // await rest.put(Routes.applicationCommands(process.env.APPID), {
    //   body: commands
    // })

    // Guild (Development)
    await rest.put(Routes.applicationGuildCommands(process.env.APPID, process.env.GUILDID), {
      body: commands
    })

    let underline = ''
    const text = 'Successfully registered slash commands.'

    for (var i = 1; i <= text.length; i++) {
      underline += '─'
    }

    console.log(colors.red(`        ╭${underline}╮`))
    console.log('' + colors.red(`        │${colors.green.bold(text)}│`))
    console.log(colors.red('        ╰' + underline + '╯'))
  } catch (error) {
    console.error(error)
  }
})()
