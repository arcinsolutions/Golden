const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume paused music"),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return interaction.reply("there is no player for this guild.");

    const { channel } = interaction.member.voice;
    
    if (!channel) return interaction.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");
    if (!player.paused) return interaction.reply("the player is already resumed.");

    player.pause(false);
    return interaction.reply("resumed the player.");
  },
};
