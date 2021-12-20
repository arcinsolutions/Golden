const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Enable repeat mode for queue or current track")
    .addStringOption((option) =>
            option
                .setName('option')
                .setDescription('the Loop option (Song|Queue|Off)')
                .setRequired(true)
                .addChoice('Song', 'song')
                .addChoice('Queue', 'queue')
        ),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return interaction.reply("there is no player for this guild.");

    const { channel } = interaction.member.voice;

    if (!channel) return interaction.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");

    const option = interaction.options.getString('option');

    if(option === 'song') {
        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
        return interaction.reply(`${trackRepeat} track repeat.`);
    }

    player.setQueueRepeat(!player.queueRepeat);
    const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
    return interaction.reply(`${queueRepeat} queue repeat.`);
   
  },
};
