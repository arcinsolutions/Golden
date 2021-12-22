const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { replyInteractionEmbed } = require("../../modules/channelModule/channelModule")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View queu")
    .addStringOption((option) =>
            option
                .setName('page')
                .setDescription('Set page')
                .setRequired(false)
        ),

  async execute(interaction, client) {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'RED');

    const queue = player.queue;
    const embed = new MessageEmbed()
      .setAuthor(`Queue for ${interaction.guild.name}`);

    // change for the amount of tracks per page
    const multiple = 10;
    const page = interaction.options.getString('page') !== null && Number(interaction.options.getString('page')) ? Number(interaction.options.getString('page')) : 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    if (queue.current) embed.addField("Current", `[${queue.current.title}](${queue.current.uri})`);

    if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`);
    else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join("\n"));

    const maxPages = Math.ceil(queue.length / multiple);

    embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

    return replyInteractionEmbed(interaction, embed);
  },
};
