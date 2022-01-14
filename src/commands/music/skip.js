const { SlashCommandBuilder } = require("@discordjs/builders");
const { replyInteractionEmbed } = require("../../modules/channelModule/channelModule")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip current song"),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
      if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'DARK_RED');
  
      const { channel } = interaction.member.voice;
      if (!channel) return replyInteraction(interaction, '', 'Join a voice channel first.', 'DARK_RED');
      if (channel.id !== player.voiceChannel) return replyInteractionEmbed(interaction, '', 'I\'ve to be in the same voice channel with you for requesting tracks.', 'DARK_RED');
  
      if (!player.queue.current) return replyInteractionEmbed(interaction, '', 'There is no music playing.', 'DARK_RED');

      const { title } = player.queue.current;

      player.stop();
      return replyInteractionEmbed(interaction, '', `${title} was skipped.`, 'DARK_GREEN');
  },
};
