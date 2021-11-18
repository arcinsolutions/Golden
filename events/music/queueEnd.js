const { MessageEmbed } = require('discord.js');

module.exports = ('queueEnd',
(client, queue) => {

  // TODO: Reset golden channel
  const Embed = new MessageEmbed()
    .setTitle('Music Player')
    .setDescription('Queue has been Ended !!')
    .setColor('RED');
  return void queue.message.channel.send({ embeds: [Embed] });
});
