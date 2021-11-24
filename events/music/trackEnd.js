const { resetGoldenChannelPlayer } = require('../../functions/channel');

module.exports = ('trackEnd',
(client, queue, track) => {
  /*const Embed = new MessageEmbed()
    .setTitle('Music Player')
    .setDescription(
      `__**Bot has Ended a Song Now**__\n**Name :** \`${track.title}\`\n**Url :** [Click here](${track.url})\n**Duration :** \`${track.human_duration}\`\n**Requested-By :** \`${track.requestedBy.username}\``,
    )
    .setColor('RED')
    .setImage(track.thumbnail);
  return queue.message.channel.send({ embeds: [Embed] });*/

  const guild = client.guilds.cache.get(queue.guildId);
  return resetGoldenChannelPlayer(guild);
});
