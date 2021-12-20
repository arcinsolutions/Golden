const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Jump to a specific duration")
    .addStringOption((option) =>
            option
                .setName('duration')
                .setDescription('Addd')
                .setRequired(true)
        ),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return interaction.reply("there is no player for this guild.");

    const { channel } = interaction.member.voice;
    
    if (!channel) return interaction.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");

    let t = interaction.options.getString('duration'); // mm:ss
    let ms = Number(t.split(':')[0]) * 60 * 1000 + Number(t.split(':')[1]) * 1000;

    player.seek(ms);
    return interaction.reply("done.");
  },
};
