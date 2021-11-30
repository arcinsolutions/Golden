const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const { sleep } = require('../../functions/random')
const { getPreview, getTracks } = require('spotify-url-info')

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

        const Queue =
            client.player.GetQueue(guildId) ??
            client.player.CreateQueue(interaction)

        let success = true

        if (await !request.includes('https')) {
            request += ' topic'
            success = await this.requestPlay(Queue, request, interaction)
        }

        if (await request.includes('spotify')) {
            if (await request.includes('track')) {
                const track = await getPreview(request)
                request = `${track.title} by ${track.artist}`
                success = await this.requestPlay(Queue, request, interaction)
            } else {
                const tracks = await getTracks(request)
                tracks.forEach(async (song) => {
                    const track = await getPreview(song.external_urls.spotify)
                    request = `${track.title} by ${track.artist}`
                    success = await this.requestPlay(Queue, request, interaction)
                    if (!success) return
                })
            }
        }

        if (success) {
            return await interaction.editReply({
                embeds: [
                    embed
                        .setDescription(`**✅ | Searching for this song..**`)
                        .setColor('DARK_GREEN'),
                ],
            })
        } else {
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
        }
    },

    requestPlay: async function (Queue, song, message) {
        return Queue.play(song, message.member.voice.channel, message.member)
    },
}
