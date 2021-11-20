const { MessageEmbed } = require('discord.js');

module.exports = ('error',
(client, message, queue, data) => {
  if (queue && queue.message) {
    const Embed = new MessageEmbed()
      .setTitle('Music Player')
      .setDescription(
        `❌ **ERROR** | Please open a Ticket on our Support Server.`,
      )
      .setColor('DARK_RED');
    return void queue.message.channel.send({ embeds: [Embed] });
  }
  return void console.log(message);
});
