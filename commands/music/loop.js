const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('let you change if the Song or Queue should be Looped!')
        .addStringOption((option) =>
            option
                .setName('option')
                .setDescription('the Loop option (Song|Queue|Off)')
                .setRequired(true)
                .addChoice('Off', 'off')
                .addChoice('Song', 'song')
                .addChoice('Queue', 'queue')
        ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const queue = client.player.GetQueue(interaction.guild.id)

        const loop = interaction.options.getString('option')

        let succes = false

        const embed = new MessageEmbed()
      .setTitle('Loop')
      .setDescription(
        `Error is caused by - \`${message}\`${
          data ? `| Where your data was -> \`${data}\`` : ''
        }`,
      )

        if (queue != undefined)
            switch (loop) {
                case 'off':
                    succes = queue.loop('off')
                    break
                case 'song':
                    succes = queue.loop('song')
                    break
                case 'queue':
                    succes = queue.loop('queue')
                    break
            }

        if(succes)
            interaction.editReply({ embeds: [embed.setColor('DARK_GREEN').setDescription(`Done ${loop}`)]})
        else
            interaction.editReply({ embeds: [embed.setColor('DARK_RED').setDescription(`Error`)]})
    },
}
