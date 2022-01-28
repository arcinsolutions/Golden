const { SlashCommandBuilder } = require("@discordjs/builders");
const { replyInteractionEmbed } = require("../../modules/channelModule/channelModule");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip current song")
    .addIntegerOption((option) => option.setName('amount').setDescription('the amount of songs to be skipped'))
    .addIntegerOption((option) => option.setName('queue_number').setDescription('the Number of the song in the Queue to which you want to Skip')),

  async execute(interaction, client)
  {
    const amount = interaction.options.getString('amount');
    const queue_number = interaction.options.getString('queue_number');
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'DARK_RED');

    const { channel } = interaction.member.voice;
    if (!channel) return replyInteractionEmbed(interaction, '', 'Join a voice channel first.', 'DARK_RED');
    if (channel.id !== player.voiceChannel) return replyInteractionEmbed(interaction, '', 'I\'ve to be in the same voice channel with you for requesting tracks.', 'DARK_RED');

    if (!player.queue.current) return replyInteractionEmbed(interaction, '', 'There is no music playing.', 'DARK_RED');

    const { title } = player.queue.current;

    if (amount != undefined) 
    {
      if (player.queue.totalSize > amount)
        return replyInteractionEmbed(interaction, '', `Queue isnt that Big ;).`, 'DARK_RED');
      for (let i = 0; i <= amount; i++)
        await player.play();
      return replyInteractionEmbed(interaction, '', `Songs was skipped.`, 'DARK_GREEN');
    }
    else if (queue_number != undefined)
    {
      if (player.queue.size > queue_number)
        return replyInteractionEmbed(interaction, '', `Queue isnt that Big ;).`, 'DARK_RED');
      for (let i = 0; i <= queue_number; i++)
        await player.play();
      return replyInteractionEmbed(interaction, '', `Songs was skipped.`, 'DARK_GREEN');
    }

    player.play();
    return replyInteractionEmbed(interaction, '', `${title} was skipped.`, 'DARK_GREEN');
  },
};
