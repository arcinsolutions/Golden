const { SlashCommandBuilder } = require("@discordjs/builders");
const { updateVolume } = require('../../modules/channelModule/channelModule')

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

    if (!player) return interaction.reply("there is no player for this guild.");
    if (interaction.options.getInteger('amount') === null) return interaction.reply(`the player volume is \`${player.volume}\`.`)

    const { channel } = interaction.member.voice;
    
    if (!channel) return interaction.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel) return interaction.reply("you're not in the same voice channel.");

    const volume = interaction.options.getInteger('amount');
    
    if (!volume || volume < 1 || volume > 100) return interaction.reply("you need to give me a volume between 1 and 100.");

    player.setVolume(volume);
    updateVolume(interaction.guild, player.queue.length, volume)
    return interaction.reply(`set the player volume to \`${volume}\`.`);
  },
};
