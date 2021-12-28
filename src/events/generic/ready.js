const { resetChannel, channelEmbedExists } = require('../../modules/channelModule/channelModule');
const { getAll } = require('../../modules/databaseModule/databaseModule');
const { setRandomActivities } = require('../../modules/activityModule/activityModule');
const { Uptime } = require('better-uptime');

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

        const registeredGuilds = getAll();

        for (const guild of registeredGuilds)
        {
            const guildId = guild.ID;
            const cachedGuild = client.guilds.cache.get(guildId);
            if (cachedGuild !== undefined && await channelEmbedExists(guildId, client))
            {
                resetChannel(cachedGuild);
            }
        }

        if (process.env.URL.includes('http'))
            new Uptime({
                url: process.env.URL,
                time: 3,
                time_type: 'minute', //millisecond, minute, hour, day, week
            });
    }
};
