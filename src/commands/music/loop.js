const { SlashCommandBuilder } = require("@discordjs/builders");
const { replyInteractionEmbed, setEmbed } = require("../../modules/channelModule/channelModule");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Enable repeat mode for queue or current track")
    .addStringOption((option) =>
            option
                .setName('option')
                .setDescription('the Loop option (Song|Queue|Off)')
                .setRequired(true)
                .addChoice('Track', 'track')
                .addChoice('Queue', 'queue')
        ),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'DARK_RED');

    const { channel } = interaction.member.voice;

    if (!channel) return replyInteractionEmbed(interaction, '', 'Join a voice channel first.', 'DARK_RED');
    if (channel.id !== player.voiceChannel) return replyInteractionEmbed(interaction, '', 'I\'ve to be in the same voice channel with you for requesting tracks.', 'DARK_RED');

    const option = interaction.options.getString('option');

    if(option === 'track') {
        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
        setEmbed(interaction.guild, player);
        return replyInteractionEmbed(interaction, '', `${trackRepeat} track repeat.`, 'DARK_GREEN');
        
    } else {

    player.setQueueRepeat(!player.queueRepeat);
    const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
    setEmbed(interaction.guild, player);
    return replyInteractionEmbed(interaction, '', `${queueRepeat} queue repeat.`, 'DARK_GREEN');
  }
  },
};
