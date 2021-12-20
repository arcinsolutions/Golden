const { resetChannel, channelEmbedExists } = require('../../modules/channelModule/channelModule')
const { getAll } = require('../../modules/databaseModule/databaseModule')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.manager.init(client.user.id);
        console.log('Bot is up and running')

        const registeredGuilds = getAll();

        for(const guild of registeredGuilds) {
            const guildId = guild.ID
            const cachedGuild = client.guilds.cache.get(guildId)
            if(cachedGuild !== undefined && await channelEmbedExists(guildId, client)) {
                resetChannel(cachedGuild)
            }
        }

    }
}
