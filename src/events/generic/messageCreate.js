const { getGuildChannel } = require("../../modules/databaseModule/databaseModule");
const { channelExists } = require("../../modules/channelModule/channelModule");
const { playTrack } = require("../../modules/musicControllerModule/musicControllerModule");
const { checkPermissions } = require("../../modules/permissionModule/permissionModule");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {

    if (channelExists(message.guild) && getGuildChannel(message.guild.id) === message.channel.id) {
      if (message.author.bot) return;

      const missingPermissions = checkPermissions(message);
      if(missingPermissions.length > 0) {
        if(missingPermissions.includes("SEND_MESSAGES")) return;
        return message.channel.send({ embeds: [new MessageEmbed().setTitle('Missing permission').setDescription(`Golden needs the following permissions in order to work properly:\n\n**${missingPermissions.join(',\n')}** `).setColor('DARK_RED').setThumbnail('https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png')] })
      }

      try {
        await message.delete();
      } catch (e) {}

      playTrack(client, message.guild, message.channel, message.member.voice.channel, message.content, message.author);

    }
  },
};
