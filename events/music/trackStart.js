const { MessageEmbed } = require('discord.js');
const { 
  setGoldenChannelPlayerThumbnail,
  setGoldenChannerlPlayerTitle,
  setGoldenChannerlPlayerQueue,
  setGoldenChannelPlayerFooter,
  resetGoldenChannelPlayer,
 } = require('../../functions/channel')

module.exports = ('trackStart',
(client, queue, track) => {

  const guild = track.requestedBy.guild;

  setGoldenChannelPlayerThumbnail(guild, track.thumbnail)
  setGoldenChannerlPlayerTitle(guild, client, `🎶 | Now Playing\n${track.title} by ${track.channelId}`)
  setGoldenChannelPlayerFooter(guild, `${queue.tracks.length-1} songs in queue | Volume: ${queue.volume}%`)

  // TODO: Queue

  return;

  /*const Embed = new MessageEmbed()
    .setTitle('Music Player')
    .setDescription(
      `__**Bot is now Playing**__\n**Name :** \`${track.title}\`\n**Url :** [Click here](${track.url})\n**Duration :** \`${track.human_duration}\`\n**Requested-By :** \`${track.requestedBy.user.username}\``,
    )
    .setColor('GREEN')
    .setImage(track.thumbnail);
  return void queue.message.channel.send({ embeds: [Embed] });*/
});
