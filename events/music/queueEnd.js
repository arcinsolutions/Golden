const { MessageEmbed } = require('discord.js');
const {
  resetGoldenChannelPlayer,
 } = require('../../functions/channel')

module.exports = ('queueEnd',
(client, queue) => {

  const guild = client.guilds.cache.get(queue.guildId);
  return resetGoldenChannelPlayer(guild);

});
