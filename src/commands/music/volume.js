const { SlashCommandBuilder } = require("@discordjs/builders");
const { replyInteractionEmbed, setEmbed } = require('../../modules/channelModule/channelModule');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Specify volume")
    .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('Volume amount (1-100)')
                .setRequired(false)
        ),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);

    if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'DARK_RED');
    if (interaction.options.getInteger('amount') === null) return replyInteractionEmbed(interaction, '', `Currently playing at ${player.volume}% volume.`, 'DARK_GREEN');

    const { channel } = interaction.member.voice;
    
    if (!channel) return replyInteractionEmbed(interaction, '', 'Join a voice channel first.', 'DARK_RED');
    if (channel.id !== player.voiceChannel) return replyInteractionEmbed(interaction, '', 'I\'ve to be in the same voice channel with you for requesting tracks.', 'DARK_RED');

    const volume = interaction.options.getInteger('amount');
    
    if (!volume || volume < 1 || volume > 100) return replyInteractionEmbed(interaction, '', 'Give me a value between 1 and 100.', 'DARK_RED');

    player.setVolume(volume);
    setEmbed(interaction.guild, player);
    return replyInteractionEmbed(interaction, '', `Set the player volume to ${volume}.`, 'DARK_GREEN');
  },
};
