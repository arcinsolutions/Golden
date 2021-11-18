const { MessageEmbed } = require('discord.js');

module.exports = ('playlistAdd',
(client, queue, tracks) => {
  const Embed = new MessageEmbed()
    .setTitle('Music Player')
    .setDescription(
      `Bot has Added a Playlist with \`${tracks.length}\` Songs`,
    )
    .setColor('GREEN');
  return void queue.message.channel.send({ embeds: [Embed] });
});
