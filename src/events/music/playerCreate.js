const { setActivePlayers, setActiveListeners, guildExists } = require('../../modules/databaseModule/databaseModule');
const { countAllListeningMembers } = require('../../modules/channelModule/channelModule')

module.exports = async (client, player) => {
    if (!process.env.ANALYTICS_ENABLED) return;
	await setActivePlayers(client.manager.players.size)
    await setActiveListeners(await countAllListeningMembers(client))
};
