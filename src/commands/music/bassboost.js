const { SlashCommandBuilder } = require("@discordjs/builders");
const { replyInteractionEmbed } = require("../../modules/channelModule/channelModule");
const levels = [
  ["none", "0.0"],
  ["Low", "0.1"],
  ["Medium", "0.15"],
  ["High", "0.25"],
  ["Extreme", "1"],
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bassboost")
    .setDescription("Add boost to your music")
    .addStringOption((option) =>
      option
        .setName("level")
        .setDescription("Choice the Level of Bassboost")
        .setRequired(true)
        .addChoices(levels)
    ),

  async execute(interaction, client) {

    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'RED');

    const { channel } = interaction.member.voice;
    
    if (!channel) return replyInteractionEmbed(interaction, '', 'Join a voice channel first.', 'RED');
    if (channel.id !== player.voiceChannel) return replyInteractionEmbed(interaction, '', 'I\'ve to be in the same voice channel with you for requesting tracks.', 'RED');

    let level = interaction.options.getString("level");

    const bands = new Array(3)
      .fill(null)
      .map((_, i) => ({ band: i, gain: level }));

    player.setEQ(...bands);

    levels.forEach((i) => {
      if (i[1] == level) level = i[0];
    });

    return replyInteractionEmbed(interaction, '', `Set the bassboost level to ${level}`, 'GREEN');
  },
};
