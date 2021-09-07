/** ++ Discord init ++ **/
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
///const { config } = require('./config/config.json');

require('dotenv').config({ path: './config/.env'});

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.data.name, command);
}
/** -- Discord init -- **/

/** ++ Colors, Console Log & Start ++ **/
var colors = require('colors/safe');

client.once('ready', () => {

	const text =  client.user.tag + ' is Online!';
	var underline = "";

	for (var i=1; i<= text.length; i++ ) {
		underline += "▬";
	}

	console.log(colors.green(underline));
	console.log(colors.green.bold(text));
	console.log(colors.green(underline));
});

client.login(process.env.TOKEN);
/** -- Color & Console Log -- **/