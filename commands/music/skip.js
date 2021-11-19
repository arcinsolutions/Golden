const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const { skip } = require('../../functions/musicControl')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song!')
        .addIntegerOption((option) =>
        option
            .setName('amount')
            .setDescription('Amount of songs you want to skip')
            .setRequired(false)
    ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()
        return void (await skip(interaction, client, interaction.options.getInteger('amount')))
    },
}
