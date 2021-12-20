const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip current song"),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
      if (!player) return interaction.reply("there is no player for this guild.");
  
      const { channel } = interaction.member.voice;
      if (!channel) return interaction.reply("you need to join a voice channel.");
      if (channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");

      if (!player.queue.current) return interaction.reply("there is no music playing.")

      const { title } = player.queue.current;

      player.stop();
      return interaction.reply(`${title} was skipped.`)
  },
};
