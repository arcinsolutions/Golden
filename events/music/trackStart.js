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

  if(queue.current == undefined)
  {
  setGoldenChannelPlayerThumbnail(guild, track.thumbnail)
  setGoldenChannerlPlayerTitle(guild, `🎶 | Now Playing:\n${track.title} by ${track.channelId}`)
  setGoldenChannelPlayerFooter(guild, queue.tracks.length-1, queue.volume)
  }
  else
  {
    setGoldenChannelPlayerThumbnail(guild, queue.current.thumbnail)
    setGoldenChannerlPlayerTitle(guild, `🎶 | Now Playing:\n${queue.current.title} by ${queue.current.channelId}`)
    setGoldenChannelPlayerFooter(guild, queue.tracks.length-1, queue.volume)
  }

  let tracksMap = ""

  queue.tracks.forEach( (track, i) => {
    if (i != 0)
      tracksMap = `\`${i}.\` ${track.title} by ${track.channelId}\n` + tracksMap 
  });

  setGoldenChannerlPlayerQueue(guild, tracksMap)

  // TODO: Queue

  return;

  /*const Embed = new MessageEmbed()
    .setTitle('Music Player')
    .setDescription(
      `__**Bot is now Playing**__\n**Name :** \`${track.title}\`\n**Url :** [Click here](${track.url})\n**Duration :** \`${track.human_duration}\`\n**Requested-By :** \`${track.requestedBy.user.username}\``,
    )
    .setColor('GREEN')
    .setImage(track.thumbnail);
  return queue.message.channel.send({ embeds: [Embed] });*/
});
