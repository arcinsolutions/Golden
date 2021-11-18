const { MessageEmbed } = require('discord.js');

module.exports = ('channelEmpty',
(client, queue, VoiceChannel) => {
  const Embed = new MessageEmbed()
    .setTitle('Music Player')
    .setDescription(`Voice Channel is Empty Now - <#${VoiceChannel.id}>`)
    .setColor('RED');
  return void queue.message.channel.send({ embeds: [Embed] });
});
