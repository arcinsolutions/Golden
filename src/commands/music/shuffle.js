const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  setEmbed,
  replyInteractionEmbed
} = require("../../modules/channelModule/channelModule");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle your queue"),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'RED');

    const { channel } = interaction.member.voice;

    if (!channel) return replyInteractionEmbed(interaction, '', 'Join a voice channel first.', 'RED');
    if (channel.id !== player.voiceChannel) return replyInteractionEmbed(interaction, '', 'I\'ve to be in the same voice channel with you for requesting tracks.', 'RED');

    if (player.queue.length < 2)
      return replyInteractionEmbed(interaction, '', 'Please add at least 2 songs to the queue.', 'RED');

    player.queue.shuffle();

    setEmbed(interaction.guild, player);
    return replyInteractionEmbed(interaction, '', 'Shuffled the queue.', 'GREEN');
  },
};
