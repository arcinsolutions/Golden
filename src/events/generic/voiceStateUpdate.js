const { setActiveListeners } = require('../../modules/databaseModule/databaseModule')
const { countAllListeningMembers } = require('../../modules/channelModule/channelModule')

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(oldUser, newUser, client) {
        if (!process.env.GRAFANA_ENABLED) return;

        if (newUser.member.user.bot) {
            const player = await client.manager.get(newUser.guild.id);
            if (player === undefined) return;
            if (newUser.channelId != player.voiceChannel) return;

            // E.g. user moved bot to another channel
            await setActiveListeners(await countAllListeningMembers(client))

        } else if (oldUser.channelId === null && newUser.channelId != null) {
            const player = await client.manager.get(newUser.guild.id);
            if (player === undefined) return;
            if (newUser.channelId != player.voiceChannel) return;

            // User joined bots channel
            await setActiveListeners(await countAllListeningMembers(client))

        } else if (oldUser.channelId != null && newUser.channelId === null) {
            const player = await client.manager.get(oldUser.guild.id);
            if (player === undefined) return;
            if (oldUser.channelId != player.voiceChannel) return;

            // User left bots channel
            await setActiveListeners(await countAllListeningMembers(client))

        } else if (oldUser.channelId != null && newUser.channelId != null) {
            const player = await client.manager.get(newUser.guild.id);
            if (player === undefined) return;
            if (oldUser.channelId != player.voiceChannel && newUser.channelId != player.voiceChannel) return;

            // User moved in or out of bots channel
            await setActiveListeners(await countAllListeningMembers(client))

        }
    },
};
