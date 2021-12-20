const { SlashCommandBuilder } = require("@discordjs/builders");
const { playTrack } = require('../../modules/musicControllerModule/musicControllerModule');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play some music")
    .addStringOption((option) =>
    option
        .setName('song')
        .setDescription('YouTube, Soundcloud, Spotify url or Songtitle')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const result = await playTrack(client, interaction.guild, interaction.channel, interaction.member.voice.channel, interaction.options.getString('song'), interaction.user)   
    if(result !== undefined)
      return interaction.reply(`added ${result.title} to the player`)

    // TODO
    },
};
