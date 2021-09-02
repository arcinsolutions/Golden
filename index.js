/** ++ Discord ++ **/
const { Client, Intents } = require('discord.js');
//const { config } = require('./config/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
/** -- Discord -- **/

/** ++ Color & Console Log+Start ++ **/
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

client.login('ODY0OTcxNDExMDY3NjMzNjY0.YO9NZg.EU11g0ob7ipC4MkDEKV8F_1Z1zo');
/** -- Color & Console Log -- **/