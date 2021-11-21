const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const { stop } = require('../../functions/musicControl')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the bot and clear the current queue!'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply();
        return void (await stop(interaction, client));
    },
}