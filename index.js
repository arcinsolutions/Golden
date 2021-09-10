/** ++ Discord init ++ **/
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
///const { config } = require('./config/config.json');

require('dotenv').config({ path: './config/.env'});

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

/** ++ Command Handler ++ */
client.commands = new Collection();
var commandFiles = "";

fs.readdirSync('./commands/').forEach((dir) => {
	commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${dir}/${file}`);
	
		client.commands.set(command.data.name, command);
	}
})


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return interaction.reply('please submit a Valid command!');

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
/** -- Command Handler -- */

/** ++ Event Handler ++ */
var eventFiles;

	eventFiles = fs.readdirSync(`./events/`).filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
	
		if (event.once) {
			client.once(event.name, (...args)=> event.execute(...args));
		} else {
			client.on(event.name, (...args)=> event.execute(...args));
		}
	}

/** -- Event Handler -- */


/** -- Discord init -- **/

/** ++ Start ++ **/
client.login(process.env.TOKEN);
/** -- Start -- **/