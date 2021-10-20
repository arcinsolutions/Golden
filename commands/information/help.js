const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('Replies with a nice Menu!'),
	async execute(interaction, client) {

		const commandsNames = client.commands.map((description) => {
			let temp = { "Name": description.data.name, "Description": description.data.description};
			return temp;
		})

		const embed = new MessageEmbed()
			.setFooter(client.user.username, client.user.displayAvatarURL())
			.setTimestamp()
			.setTitle('**Help Menu**')
			.setColor('DARK_GREEN');

		for (var i = 0; i < commandsNames.length; i++) {
			const name = commandsNames[i].Name.toString();
			const description = commandsNames[i].Description.toString();
			console.log(name + ' : ' + description);
			embed.addField(`**${name}**`, description, false);
		}

		await interaction.reply({
			embeds: [ embed ]
		});

	}
};
