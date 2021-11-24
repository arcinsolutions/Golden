const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const { sleep } = require('../../functions/random')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or a PlayList!')
        .addStringOption((option) =>
            option
                .setName('song')
                .setDescription('YouTube, Soundcloud, Spotify url or Songtitle')
                .setRequired(true)
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
        let request = interaction.options.getString('song')
        if (!request.includes('https')) request += ' topic'

        const Queue =
            client.player.GetQueue(guildId) ??
            client.player.CreateQueue(interaction)
        const success = await Queue.play(
            request,
            interaction.member.voice.channel,
            interaction.member
        )

        if (success) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`**✅ | Searching for this song..**`)
                        .setColor('DARK_GREEN'),
                ],
            })
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
