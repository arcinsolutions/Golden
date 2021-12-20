const format = require('format-duration');
const { setEmbed, generateQueue } = require('../channelModule/channelModule');

module.exports = {
  trackLoaded: async function (guild, player, track) {
    player.queue.add(track);

    if (!player.playing && !player.paused && !player.queue.size) player.play();

    if (player.queue.length >= 1) {
      const duration = player.queue.current.isStream
        ? "LIVE"
        : format(player.queue.current.duration);
      setEmbed(
        guild,
        `🎶 | Now playing: ${player.queue.current.title} by ${player.queue.current.author} [${duration}]`,
        player.queue.current.uri,
        generateQueue(player.queue),
        player.queue.current.displayThumbnail("maxresdefault"),
        player.queue.length,
        player.volume
      );
    } else {
      if (track.thumbail === undefined && track.resolve !== undefined)
        await track.resolve("thumbnail"); // fetch thumbnail
      const duration = track.isStream ? "LIVE" : format(track.duration);
      setEmbed(
        guild,
        `🎶 | Now playing: ${track.title} by ${track.author} [${duration}]`,
        track.uri,
        generateQueue(player.queue),
        track.displayThumbnail("maxresdefault"),
        player.queue.length,
        player.volume
      );
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
      // this song is now the song playing!
      if (player.queue.current.thumbnail === undefined)
        await firstTrack.resolve("thumbnail"); // fetch thumbnail
      setEmbed(
        guild,
        `🎶 | Now playing: ${player.queue.current.title} by ${
          player.queue.current.author
        } [${format(player.queue.current.duration)}]`,
        player.queue.current.uri,
        generateQueue(player.queue),
        player.queue.current.displayThumbnail("maxresdefault"),
        player.queue.length,
        player.volume
      );
    } else {
      setEmbed(
        guild,
        `🎶 | Now playing: ${firstTrack.title} by ${
          firstTrack.author
        } [${format(rfirstTrack.duration)}]`,
        firstTrack.uri,
        generateQueue(player.queue),
        firstTrack.displayThumbnail("maxresdefault"),
        player.queue.length,
        player.volume
      );
    }
  },

  searchResult: async function (guild, player, track) {
    player.queue.add(track);

    if (!player.playing && !player.paused && !player.queue.size) player.play();

    if (player.queue.length >= 1) {
      // this song is now the song playing!
      const duration = player.queue.current.isStream
        ? "LIVE"
        : format(player.queue.current.duration);
      setEmbed(
        guild,
        `🎶 | Now playing: ${player.queue.current.title} by ${player.queue.current.author} [${duration}]`,
        player.queue.current.uri,
        generateQueue(player.queue),
        player.queue.current.displayThumbnail("maxresdefault"),
        player.queue.length,
        player.volume
      );
    } else {
      const duration = track.isStream
        ? "LIVE"
        : format(track.duration);
      setEmbed(
        guild,
        `🎶 | Now playing: ${track.title} by ${track.author} [${duration}]`,
        track.uri,
        generateQueue(player.queue),
        track.displayThumbnail("maxresdefault"),
        player.queue.length,
        player.volume
      );
    }

    return track;
  },
};
