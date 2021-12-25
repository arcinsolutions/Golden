const { resetChannel } = require('../../modules/channelModule/channelModule');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, player, oldChannel, newChannel) => {
	const guild = client.guilds.cache.get(player.guild);
	if (!guild) return;
	if (oldChannel === newChannel) return;
	if (newChannel === null || !newChannel) {
		if (!player) return;
		await player.destroy();
		return resetChannel(guild);
	} else {
		player.voiceChannel = newChannel;
		if (player.paused) player.pause(false);
	}
};
