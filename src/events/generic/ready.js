const { resetChannel, channelEmbedExists, countAllListeningMembers } = require('../../modules/channelModule/channelModule');
const { getAllGuilds, setActiveListeners, setActivePlayers } = require('../../modules/databaseModule/databaseModule');
const { setRandomActivities } = require('../../modules/activityModule/activityModule');
const { Uptime } = require('better-uptime');
const { createTables } = require('../../modules/databaseModule/databaseModule')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client)
    {
        setRandomActivities(client);
        client.manager.init(client.user.id);
        const text = 'Bot is up and running';
        console.log('╭' + '─'.repeat(65) + '╮');
        console.log(
            '│ ' + ' '.repeat((64 - text.length) / 2) +
            text + ' '.repeat((64 - text.length) / 2) +
            ' │'
        );
        console.log('╰' + '─'.repeat(65) + '╯');

        await createTables(); // create tables if not exists

        const registeredGuilds = await getAllGuilds();

        for (const guild of registeredGuilds)
        {
            const guildId = guild.guildId;
            const cachedGuild = await client.guilds.cache.get(guildId);

            if (cachedGuild !== undefined && await channelEmbedExists(guildId, client))
                resetChannel(cachedGuild);
        }

        if (process.env.URL.includes('http'))
            new Uptime({
                url: process.env.URL,
                time: 3,
                time_type: 'minute', //millisecond, minute, hour, day, week
            });
        
        if (process.env.GRAFANA_ENABLED) {
            await setActivePlayers(client.manager.players.size)
            await setActiveListeners(await countAllListeningMembers(client))
        }
    }
};
