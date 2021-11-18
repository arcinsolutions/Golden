const { MessageEmbed } = require('discord.js');
const {
  resetGoldenChannelPlayer,
 } = require('../../functions/channel')

module.exports = ('queueEnd',
(client, queue) => {

  // TODO: Reset golden channel
  const Embed = new MessageEmbed()
    .setTitle('Music Player')
    .setDescription('Queue has been Ended !!')
    .setColor('RED');

  resetGoldenChannelPlayer(queue.guildid)
  return void queue.message.channel.send({ embeds: [Embed] });
});
