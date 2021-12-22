const format = require('format-duration');
const { setEmbed, generateQueue } = require('../channelModule/channelModule');

module.exports = {
  trackLoaded: async function (guild, player, track) {
    player.queue.add(track);

    if (!player.playing && !player.paused && !player.queue.size) player.play();

    if (player.queue.length >= 1) {
      setEmbed(guild, player);
    } else {
      if (track.thumbail === undefined && track.resolve !== undefined)
        await track.resolve("thumbnail"); // fetch thumbnail
        setEmbed(guild, player);
    }
  },

  playlistLoaded: async function (guild, player, tracks) {
    const firstTrack = tracks[0];
    player.queue.add(tracks);

    if (
      !player.playing &&
      !player.paused &&
      player.queue.totalSize === tracks.length
    )
      player.play();

    if (player.queue.length >= 1) {
      if (player.queue.current.thumbnail === undefined)
        await firstTrack.resolve("thumbnail"); // fetch thumbnail
        setEmbed(guild, player);
    } else {
      setEmbed(guild, player);
    }
  },

  searchResult: async function (guild, player, track) {
    player.queue.add(track);

    if (!player.playing && !player.paused && !player.queue.size) player.play();

    if (player.queue.length >= 1) { // TODO ???
      setEmbed(guild, player);
    } else {
      setEmbed(guild, player);
    }

    return track;
  },
};
