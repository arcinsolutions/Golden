const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const { sleep } = require('../../functions/random')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current song!'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        if (!interaction.member.voice.channel) {
            await interaction.editReply({
                embeds: [
                    embed
                        .setDescription(
                            `**❌ | <@${interaction.member.id}> You have to join a voice channel first**`
                        )
                        .setColor('DARK_RED'),
                ],
            })
            await sleep(10000)
            return await interaction.deleteReply()
        }

        const guildId = interaction.guild.id

        const Queue = client.player.GetQueue(guildId)
        if (!Queue || (Queue && !Queue.tracks[0])) {
            await interaction.editReply({
                embeds: [
                    embed
                        .setDescription(
                            `**❌ | The Queue is Empty or the Next Track isn´t Present in Queue!**`
                        )
                        .setColor('DARK_RED'),
                ],
            })
            await sleep(10000)
            return await interaction.deleteReply()
        }
        const success = Queue.resume()
        if (success) {
            await interaction.editReply({
                embeds: [
                    embed
                        .setDescription(
                            `**✅ | Songs has been Resumed/Un-Paused**`
                        )
                        .setColor('DARK_GREEN'),
                ],
            })
            await sleep(10000)
            return await interaction.deleteReply()
        }
        await interaction.editReply({
            embeds: [
                embed
                    .setDescription(
                        `**❌ | Please open a Ticket on our Support Server.**`
                    )
                    .setColor('DARK_RED'),
            ],
        })
        await sleep(10000)
        return await interaction.deleteReply()
    },
}
