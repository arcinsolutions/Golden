const { generateQueue, setEmbed } = require('../../modules/channelModule/channelModule');
const format = require('format-duration');

module.exports = async (client, player, track, payload) => {

    const guild = await client.guilds.fetch(player.guild);

    if(guild === undefined) return;

    const formattedQueue = await generateQueue(player.queue);
    const duration = track.isStream ? "LIVE" : format(track.duration);

    setEmbed(guild, `🎶 | Now playing: ${track.title} by ${track.author} [${duration}]`, track.uri, formattedQueue, track.displayThumbnail("maxresdefault"), player.queue.length, player.volume);
}
