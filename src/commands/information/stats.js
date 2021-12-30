const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getGlobal } = require("../../modules/databaseModule/databaseModule");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View statistics about Golden"),

  alias: ['status'],
  async execute(interaction, client) {
    const embed = new MessageEmbed();

    const sent = await interaction.reply({
      embeds: [embed.setDescription(`**Pinging...**`).setColor('DARK_RED')],
      fetchReply: true,
    });

    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    const usage = process.cpuUsage();

    interaction.editReply({
      embeds: [
        embed
          .setDescription("")
          .addFields(
            {
              name: "Uptime",
              value: `${days} day${days === 1 ? "" : "s"}, ${hours} hour${
                hours === 1 ? "" : "s"
              }, ${minutes} minute${
                minutes === 1 ? "" : "s"
              } & ${seconds} second${seconds === 1 ? "" : "s"}`,
            },
            {
              name: `Ping`,
              value: `${
                sent.createdTimestamp - interaction.createdTimestamp
              }ms`,
              inline: true,
            },
            {
              name: "Discord API Ping",
              value: `${client.ws.ping}ms`,
              inline: true,
            },
            {
              name: "\u200B",
              value: `\u200B`,
              inline: true,
            },
            {
              name: "CPU usage",
              value: `${process.cpuUsage(usage).user / 100} %`,
              inline: true,
            },
            {
              name: "RAM usage",
              value: `${
                Math.round(
                  (process.memoryUsage().heapUsed / 1024 / 1024) * 100
                ) / 100
              }MB\n`,
              inline: true,
            },
            {
              name: "\u200B",
              value: `\u200B`,
              inline: true,
            },
            {
              name: "Servers",
              value: `${client.guilds.cache.size}`,
              inline: true,
            },
            {
              name: "Golden channels",
              value: `${getGlobal().stats.goldenChannelCount}`,
              inline: true,
            },
            {
              name: "Users",
              value: `${client.users.cache.size}`,
              inline: true,
            }
          )
          .setColor("DARK_GREEN"),
      ],
    });
  },
};
