const { resetChannel } = require("../../modules/channelModule/channelModule");

module.exports = async (client, player) =>
{
  if (player.get('autoplay'))
  {
    const previoustrack = player.get("previoustrack");
    const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
    const response = await player.search(mixURL, previoustrack.requester);
    return player.play(response.tracks[Math.floor(Math.random() * response.tracks.length)]);
  }

  const guild = await client.guilds.fetch(player.guild);
  resetChannel(guild, player.volume);
  player.destroy();
};
