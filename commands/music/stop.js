const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the bot and clear the current queue!'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const guildId = interaction.guild.id;

        const Queue = client.player.GetQueue(guildId);
        if (!Queue || (Queue && !Queue.current)) {
          const ErrorEmbed = {
            title: 'Empty Queue',
            description: 'No Songs are playing in `Queue`\nSongs can\'t be `Stopped`',
          };
          return void (await interaction.editReply({ embeds: [ErrorEmbed] }));
        }
        const success = Queue.stop();
        if (success) {
          const ReturnEmbed = {
            title: 'Songs has been Stopped',
          };
          return void (await interaction.editReply({ embeds: [ReturnEmbed] }));
        }
        const ErrorEmbed = {
          title: 'Songs can\'t be Stopped',
        };
        return void (await interaction.editReply({ embeds: [ErrorEmbed] }));

    },
}