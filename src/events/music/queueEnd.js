const { resetChannel } = require("../../modules/channelModule/channelModule");

module.exports = async (client, player) =>
{
  if (player.get('autoplay'))
  {
    const prevtrack = player.get("prevtrack");
    const prevMixURL = `https://www.youtube.com/watch?v=${prevtrack.identifier}&list=RD${prevtrack.identifier}`;
    const prevResponse = await player.search(prevMixURL, 'Autoplay');

    if (player.get('prevprevtrack'))
    {
      const prevprevtrack = player.get('prevprevtrack');
      const prevprevMixURL = `https://www.youtube.com/watch?v=${prevprevtrack.identifier}&list=RD${prevprevtrack.identifier}`;
      const prevprevResponse = await player.search(prevprevMixURL, 'Autoplay');
      const equalSongs = [];
      prevResponse.tracks.forEach(song =>
      {
        prevprevResponse.tracks.forEach(prevSong =>
        {
          if (song.identifier == prevSong.identifier && song.identifier != prevprevtrack.identifier)
            equalSongs.push(song);
        });
        console.log(equalSongs.length);
      });

      if (equalSongs.length != 0)
        return player.play(equalSongs[Math.floor(Math.random() * equalSongs.length)]);
    }
    return player.play(prevResponse.tracks[1]);
  }

  const guild = await client.guilds.fetch(player.guild);
  resetChannel(guild, player.volume);
  player.destroy();
};
