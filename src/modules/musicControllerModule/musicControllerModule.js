const {
  resetChannel,
  sendTemporaryMessage,
  setEmbed
} = require("../channelModule/channelModule");
const {
  trackLoaded,
  playlistLoaded,
  searchResult
} = require("../musicPlayerModule/musicPlayerModule");
const { createEmbed } = require('../embedModule/embedModule')

module.exports = {
  playPause: async function (interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    const member = interaction.guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) return;
    if (voiceChannel.id !== player.voiceChannel) return;

    await player.paused ? player.pause(false) : player.pause(true);

    setEmbed(interaction.guild, player);
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

  shuffle: function(interaction) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return;

    const { channel } = interaction.member.voice;

    if (!channel) return;
    if (channel.id !== player.voiceChannel) return;

    if (player.queue.length < 2) return;

    player.queue.shuffle();

    setEmbed(interaction.guild, player);
  },

  playTrack: async function (client, guild, channel, voiceChannel, content, author, interaction) {

    if (!voiceChannel)
      return sendTemporaryMessage(channel, { embeds: [createEmbed('', 'Join a voice channel before requesting tracks.', 'DARK_RED')] }, 10000);

    const player = await client.manager.create({
      guild: guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: channel.id,
    });
    
    if (voiceChannel.id !== player.voiceChannel) 
      return sendTemporaryMessage(channel, { embeds: [createEmbed('', 'I\'ve to be in the same voice channel with you for requesting tracks.', 'DARK_RED')] }, 10000);

    if (content.includes('https://open.spotify.com/episode') || content.includes('https://open.spotify.com/show'))
      return sendTemporaryMessage(channel, { embeds: [createEmbed('', 'I don\'t support podcasts from Spotify for now, please use another source.', 'DARK_RED')] }, 10000);

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
      return sendTemporaryMessage(channel,  { embeds: [createEmbed('', `There was an error while searching: ${err.message}`, 'DARK_RED')] }, 10000);
    }

    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return sendTemporaryMessage(
          channel,
          { embeds: [createEmbed('', 'I couldn\'t find what you were looking for.', 'DARK_RED')] },
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
