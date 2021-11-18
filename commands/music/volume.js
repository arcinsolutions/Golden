const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const { setGoldenChannelPlayerFooter } = require('../../functions/channel')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set the volume')
        .addIntegerOption((option) =>
        option
            .setName('amount')
            .setDescription('Volume amount')
            .setRequired(false)
    ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const guildId = interaction.guild.id;
        const volumeAmount = interaction.options.getInteger('amount');

        const Queue = client.player.GetQueue(guildId);
        if (!Queue || (Queue && !Queue.current)) {
          const ErrorEmbed = {
            title: 'Empty Queue',
            description: 'No Songs are playing in `Queue`',
          };
          return void (await interaction.editReply({ embeds: [ErrorEmbed] }));
        } if (volumeAmount == null) {
          const ReturnEmbed = {
            title: 'Volume Stats',
            description: `**Queue Volume/Current Volume :** \`${Queue.volume}\``,
          };
          return void (await interaction.editReply({ embeds: [ReturnEmbed] }));
        }
        Queue.volume = volumeAmount ?? 95;
        setGoldenChannelPlayerFooter(interaction.guild, `${Queue.tracks.length} songs in queue | Volume: ${Queue.volume}%`);
        const ReturnEmbed = {
          title: 'Volume Stats',
          description: `**Queue Volume/Changed Volume :** \`${Queue.volume}\``,
        };
        return void (await interaction.editReply({ embeds: [ReturnEmbed] }));

    },
}