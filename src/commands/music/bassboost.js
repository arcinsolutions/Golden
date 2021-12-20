const { SlashCommandBuilder } = require("@discordjs/builders");
const levels = {
    none: 0.0,
    low: 0.10,
    medium: 0.15,
    high: 0.25,
    extreme: 1
  };

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bassboost")
    .setDescription("Add boost to your music")
    .addStringOption((option) =>
            option
                .setName('level')
                .setDescription('none/low/medium/high/extreme')
                .setRequired(true)
        ),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return interaction.reply("there is no player for this guild.");

    const { channel } = interaction.member.voice;
    
    if (!channel) return interaction.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");

    let level = "none";
    if (interaction.options.getString('level').toLowerCase() in levels) level = interaction.options.getString('level').toLowerCase();

    const bands = new Array(3)
      .fill(null)
      .map((_, i) =>
        ({ band: i, gain: levels[level] })
      );

    player.setEQ(...bands);

    return interaction.reply(`set the bassboost level to ${level}`);
  },
};
