const {
  resetChannel,
  sendTemporaryMessage
} = require("../channelModule/channelModule");
const {
  trackLoaded,
  playlistLoaded,
  searchResult
} = require("../musicPlayerModule/musicPlayerModule");

module.exports = {
  playPause: function (interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    const member = interaction.guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) return;
    if (voiceChannel.id !== player.voiceChannel) return;

    player.paused ? player.pause(false) : player.pause(true);
  },

  stop: function (interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    const member = interaction.guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) return;
    if (voiceChannel.id !== player.voiceChannel) return;

    player.destroy();
    resetChannel(interaction.guild);
  },

  skip: function (interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    const member = interaction.guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) return;
    if (voiceChannel.id !== player.voiceChannel) return;

    if (!player.queue.current) return;

    player.stop();
  },

  playTrack: async function (client, guild, channel, voiceChannel, content, author) {
    if (!voiceChannel)
      return sendTemporaryMessage(channel, "you need to join a voice channel.", 10000);

    const player = await client.manager.create({
      guild: guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: channel.id,
    });

    if (player.state !== "CONNECTED") player.connect();

    const search = content;
    let res;

    try {
      res = await player.search(search, author);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      return sendTemporaryMessage(channel, `there was an error while searching: ${err.message}`, 10000);
    }

    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return sendTemporaryMessage(
          channel,
          `couldn't find what you were looking for`,
          10000
        );

      case "TRACK_LOADED":
        return await trackLoaded(guild, player, res.tracks[0]);

      case "PLAYLIST_LOADED":
        return await playlistLoaded(guild, player, res.tracks);

      case "SEARCH_RESULT":
        return await searchResult(guild, player, res.tracks[0]);
    }
  },
};
