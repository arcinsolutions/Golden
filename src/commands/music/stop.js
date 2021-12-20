const { SlashCommandBuilder } = require("@discordjs/builders");
const { resetChannel } = require('../../modules/channelModule/channelModule')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playing music"),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return interaction.reply("there is no player for this guild.");

    const { channel } = interaction.member.voice;
    
    if (!channel) return interaction.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");
    
    player.destroy();
    resetChannel(interaction.guild);
    return interaction.reply("destroyed the player.");
  },
};
