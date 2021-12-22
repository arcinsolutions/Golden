const { generateQueue, setEmbed } = require('../../modules/channelModule/channelModule');
const format = require('format-duration');

module.exports = async (client, player, track, payload) => {

    const guild = await client.guilds.fetch(player.guild);

    if(guild === undefined) return;
    
    setEmbed(guild, player);
}
