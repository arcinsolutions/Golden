const { resetChannel, channelEmbedExists, countAllListeningMembers } = require('../../modules/channelModule/channelModule');
const { getAllGuilds, setActiveListeners, setActivePlayers, closeConnection } = require('../../modules/databaseModule/databaseModule');
const { setRandomActivities } = require('../../modules/activityModule/activityModule');
const { Uptime } = require('better-uptime');
const { createTables } = require('../../modules/databaseModule/databaseModule')
const { cleanCommands } = require('../../modules/handlerModule/handlerModule')

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

        await createTables().catch(err => {
            console.log(err);
            process.exit()
        }); // create tables if not exists

        process.on('SIGINT', function() {
            process.exit()
        });
        process.on('exit', function() {
            closeConnection().catch(err => console.log(err))
            process.exit()
        });

        const registeredGuilds = await getAllGuilds();

        for (const guild of registeredGuilds)
        {
            const guildId = guild.guildId;
            const cachedGuild = await client.guilds.cache.get(guildId);

            if (cachedGuild !== undefined && await channelEmbedExists(guildId, client))
                resetChannel(cachedGuild);
        }

        cleanCommands(client) // delete registered commands, which no longer exists in the bot

        if (process.env.BETTERUPTIME_ENABLED === 'true')
            new Uptime({
                url: process.env.BETTERUPTIME_HEARTBEAT_URL,
                time: Number(process.env.BETTERUPTIME_TIME),
                time_type: process.env.BETTERUPTIME_TIME_TYPE, //millisecond, minute, hour, day, week
            });
        
        if (process.env.ANALYTICS_ENABLED) {
            await setActivePlayers(client.manager.players.size)
            await setActiveListeners(await countAllListeningMembers(client))
        }

        require('console-stamp')(console, {
            format: ':date(dd.mm HH:MM:ss)'
        });
    }
};
