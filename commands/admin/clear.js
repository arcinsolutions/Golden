const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDefaultPermission(false)
		.setDescription('delete a Specific amount of Messages!')
		.addIntegerOption((option) =>
			option.setName('amount').setDescription('Specify the Amount of Messages get deleted!').setRequired(true)
		),

	async execute(interaction, client) {
		const amount = interaction.options.getInteger('amount');

		const embed = new MessageEmbed().setFooter(client.user.username, client.user.displayAvatarURL()).setTimestamp();

		if (amount <= 0) {
			return interaction.reply({
				embeds: [ embed.setDescription(`**the Amount can´t be that small! (Min 1)**`).setColor('DARK_RED') ],
				ephemeral: true
			});
		} else if (amount > 100) {
			return interaction.reply({
				embeds: [ embed.setDescription(`**the Amount can´t be that big! (Max 100)**`).setColor('DARK_RED') ],
				ephemeral: true
			});
		} else {
			await interaction.deferReply({ ephemeral: true });

			try {
				return interaction.channel.messages.fetch({ limit: amount }).then((messages) => {
					// interaction.deferReply({ ephemeral: true })
					interaction.channel.bulkDelete(messages);
					interaction.editReply({
						embeds: [
							embed.setDescription(`**${messages.size} Messages were delted!**`).setColor('DARK_RED')
						],
						ephemeral: true
					}); // | Command ID: ${interaction.id} | ${messages.size} Messages
				});
			} catch (e) {
				interaction.editReply(`${e}`);
			}

			// return interaction.reply(`${amount} Messages got deleted`)
		}
	}
};
