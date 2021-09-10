const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with Help!'),
	async execute(interaction) {
		await interaction.reply('Help!');
	},
};