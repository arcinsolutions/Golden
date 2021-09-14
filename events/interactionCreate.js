module.exports = {
	name: 'interactionCreate', 
		execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} (${interaction.channel.id}) triggered an interaction (${interaction.commandName}).`);
	},
};