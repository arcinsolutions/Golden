const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('Replies with a nice Menu!'),
	async execute(interaction, client) {
		// const commandsCollection = client.commands.map((description) => {
		// 	return `${description.data.name}, ${description.data.description}\n`; // Hide syntax if empty
		// });

    const commandsCollection = client.commands.toJSON()

		const embed = new MessageEmbed()
			.setFooter(client.user.username, client.user.displayAvatarURL())
			.setTimestamp()
			.setColor('DARK_GREEN')

			console.log(commandsCollection.data)

		// for (let index = 0; index < commandsCollection.size; index++) {
		// 	embed.addField(commandsCollection.data.name)
			
		// }

		await interaction.reply({
			embeds: [ embed.setAuthor('Help') ]
		});

    console.log(commandsCollection)

		// await interaction.reply(commandsCollection.join(''))
	}
};
