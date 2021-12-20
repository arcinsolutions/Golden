const { resetChannel } = require("../../modules/channelModule/channelModule");

module.exports = async (client, player) => {
  const guild = await client.guilds.fetch(player.guild);
  resetChannel(guild, player.volume);
  player.destroy();
};
