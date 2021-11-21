const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const { setGoldenChannelPlayerFooter } = require('../../functions/channel')
const { sleep } = require('../../functions/random')

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
        const volumeAmount = interaction.options.getInteger('amount')

        const Queue = client.player.GetQueue(guildId)
        if (!Queue || (Queue && !Queue.current)) {
            return (await interaction.editReply({ embeds: [embed.setDescription(`**❌ | The Queue is Empty!**`).setColor('DARK_RED')] }))
        }
        if (volumeAmount == null) {
            return (await interaction.editReply({ embeds: [embed.setDescription(`✅ | **Queue Volume/Current Volume :** \`${Queue.volume}\``).setColor('DARK_GREEN')] }))
        }
        Queue.volume = volumeAmount ?? 95
        setGoldenChannelPlayerFooter(
            interaction.guild,
            Queue.tracks.length,
            Queue.volume
        )
        return (await interaction.editReply({ embeds: [embed.setDescription(`✅ | **Queue Volume/Current Volume :** \`${Queue.volume}\``).setColor('DARK_GREEN')] }))
    },
}
