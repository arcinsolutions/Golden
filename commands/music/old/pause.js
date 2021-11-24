const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song!'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.playing)
            return void interaction.editReply({
                embeds: [
                    embed
                        .setDescription('**❌ | No music is being played!**')
                        .setColor('DARK_RED'),
                ],
            })
        const paused = queue.setPaused(true)
        return void interaction.editReply({
            embeds: [
                embed
                    .setDescription(paused ? '⏸ | Paused!' : '**❌ | Something went wrong!**')
                    .setColor(paused ? 'DARK_GREEN' : 'DARK_RED'),
            ],
        })
    },
}
