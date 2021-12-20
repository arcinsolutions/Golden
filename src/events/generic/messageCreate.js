const { getGuildChannel } = require("../../modules/databaseModule/databaseModule");
const { channelExists } = require("../../modules/channelModule/channelModule");
const { playTrack } = require("../../modules/musicControllerModule/musicControllerModule");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {

    if (channelExists(message.guild) && getGuildChannel(message.guild.id) === message.channel.id) {
      if (message.author.bot) return;

      try {
        await message.delete();
      } catch (e) {}

      playTrack(client, message.guild, message.channel, message.member.voice.channel, message.content, message.author);

    }
  },
};
