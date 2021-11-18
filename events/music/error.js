const { MessageEmbed } = require('discord.js');

module.exports = ('error',
(client, message, queue, data) => {
  if (queue && queue.message) {
    const Embed = new MessageEmbed()
      .setTitle('Music Player')
      .setDescription(
        `Error is caused by - \`${message}\`${
          data ? `| Where your data was -> \`${data}\`` : ''
        }`,
      )
      .setColor('RED');
    return void queue.message.channel.send({ embeds: [Embed] });
  }
  return void console.log(message);
});
