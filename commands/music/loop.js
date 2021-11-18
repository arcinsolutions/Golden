const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('let you change if the Song or Queue should be Looped!')
        .addStringOption((option) =>
        option
            .setName('page')
            .setDescription('the Queue Page')
            .setRequired(false)
            .addChoice('Song', 'song')
            .addChoice('Queue', 'queue')
    ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

    },
}
