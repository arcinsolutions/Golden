const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('Replies with a nice Menu!'),
	async execute(interaction, client) {
		const commandsNames = client.commands.map((description) => {
			return `${description.data.name}`; // Hide syntax if empty
		});
		const commandsNamesArr = Array.from(commandsNames);

		const commandsDescriptions = client.commands.map((description) => {
			return `${description.data.description}`; // Hide syntax if empty
		});
		const commandsDescriptionsArr = Array.from(commandsDescriptions);

		const embed = new MessageEmbed()
			.setFooter(client.user.username, client.user.displayAvatarURL())
			.setTimestamp()
			.setTitle('**Help Menu**')
			.addField('**Name** : Description', ', ', false)
			.setColor('GOLD');

		console.log(commandsNamesArr[0]);

		for (var i = 0; i < commandsNamesArr.length; i++) {
			const name = commandsNamesArr[i].toString();
			const description = commandsDescriptionsArr[i].toString();
			console.log(name + ' : ' + description);
			embed.addField(`**${name}** : ${description} `, ', ', false);
		}

		// for (let index = 0; index < commandsCollection.size; index++) {
		// 	embed.addField(commandsCollection.data.name)

		// }

		await interaction.reply({
			embeds: [ embed ]
		});

		// console.log(commandsCollectionNames[0], commandsCollectionDescriptions[0]);
	}
};
