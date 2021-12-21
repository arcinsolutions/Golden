const {
  SlashCommandBuilder,
  SlashCommandStringOption,
} = require("@discordjs/builders");
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
    // console.log(levels[0]);

    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return interaction.reply("there is no player for this guild.");

    const { channel } = interaction.member.voice;

    if (!channel) return interaction.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return interaction.reply("you're not in the same voice channel.");

    let level = interaction.options.getString("level");

    const bands = new Array(3)
      .fill(null)
      .map((_, i) => ({ band: i, gain: level }));

    player.setEQ(...bands);

    levels.forEach((i) => {
      if (i[1] == level) level = i[0];
    });

    return interaction.reply(`set the bassboost level to ${level}`);
  },
};
