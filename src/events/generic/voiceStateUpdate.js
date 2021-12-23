const { resetChannel } = require("../../modules/channelModule/channelModule");

module.exports = {
	name: 'voiceStateUpdate',
	once: false,
	async execute(oldState, newState, client) {
		console.log(oldState.channel + ` new: ` + newState.channel);

        // check if Kicked
		if (oldState.channel == newState.channel) {

            //check if Bot
			if (newState.id == client.user.id) {
				const player = await client.manager.get(newState.guild.id);
				player.destroy();
				await resetChannel(newState.guild);
			}
		}
	},
};
