const { SlashCommandBuilder } = require('@discordjs/builders')
const { getRandomActivity } = require('../../functions/random')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDefaultPermission(false)
        .setDescription('Disabled!'),
        // .setDescription('change the Activity of the Bot!'),

		category: path.basename(__dirname),
    async execute(interaction, client) {
        try {
            getRandomActivity(client)
        } catch (e) {
            console.log(e)
        }
        return interaction.reply('Current Activity changed!')
    },
}
