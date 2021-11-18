const { MessageEmbed } = require('discord.js');

module.exports = ('trackEnd',
(client, queue, track) => {
  return;
  /*const Embed = new MessageEmbed()
    .setTitle('Music Player')
    .setDescription(
      `__**Bot has Ended a Song Now**__\n**Name :** \`${track.title}\`\n**Url :** [Click here](${track.url})\n**Duration :** \`${track.human_duration}\`\n**Requested-By :** \`${track.requestedBy.username}\``,
    )
    .setColor('RED')
    .setImage(track.thumbnail);
  return void queue.message.channel.send({ embeds: [Embed] });*/
});
