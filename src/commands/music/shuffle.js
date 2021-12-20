const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  setEmbed,
  generateQueue,
} = require("../../modules/channelModule/channelModule");
const format = require("format-duration");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle your queue"),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return interaction.reply("there is no player for this guild.");

    const { channel } = interaction.member.voice;

    if (!channel) return interaction.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return interaction.reply("you're not in the same voice channel.");

    if (player.queue.length < 2)
      return interaction.reply("please add at least 2 songs to the queue.");

    player.queue.shuffle();

    const duration = player.queue.current.isStream ? "LIVE" : format(player.queue.current.duration);
    setEmbed(
      interaction.guild,
      `${player.queue.current.title} by ${player.queue.current.author} [${duration}]`,
      player.queue.current.uri,
      generateQueue(player.queue),
      player.queue.current.displayThumbnail("maxresdefault"),
      player.queue.length,
      player.volume
    );

    return interaction.reply(`shuffled the queue!.`);
  },
};
