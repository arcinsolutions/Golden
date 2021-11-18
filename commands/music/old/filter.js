const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Enable/Disable a filter to the Queue!')
        .addStringOption((option) =>
            option
                .setName('filter')
                .setDescription('The Audio Filters')
                .setRequired(true)
                .addChoice('Disable', 'disable')
                .addChoice('Bassboost', 'bassboost')
                .addChoice('8D', '8D')
                .addChoice('Earrape', 'earrape')
        ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const filter = interaction.options.getString('filter')

        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.playing)
            return void interaction.editReply({
                content: '❌ | No music is being played!',
            })
        await queue.setFilters({
            bassboost: !queue.getFiltersEnabled().includes(filter),
            // if(filter = 'bassboost')
            // {
            //     normalizer2: !queue.getFiltersEnabled().includes(filter), // because we need to toggle it with bass
            // }
        })

        setTimeout(() => {
            return void interaction.editReply({
                content: `🎵 | ${filter} ${
                    queue.getFiltersEnabled().includes(filter)
                        ? 'Enabled'
                        : 'Disabled'
                }!`,
            })
        }, queue.options.bufferingTimeout)
    },
}
