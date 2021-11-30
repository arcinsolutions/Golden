const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('let you see the current Queue'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()
        let page = 1

        const guildId = interaction.guild.id
        const queue = client.player.GetQueue(guildId)

        if (page == null) page = 1
        const pageStart = 10 * (page - 1)
        const pageEnd = pageStart + 10
        const tracks = queue.tracks
            .slice(pageStart, pageEnd)
            .map((track, i) => {
                let pos = i + pageStart + 1
                if (pos == 1)
                    return `\`Now Playing.\` ** | [${track.title} by ${track.channelId}](${track.url})**`
                else
                    return `\`${i + pageStart + 0}.\` ** | [${track.title} by ${
                        track.channelId
                    }](${track.url})**`
            })

        await interaction.editReply({
            embeds: [this.setEmbed(queue, page)],
        })

        const filter = (page) => (page.customId === 'previous' || page.customId === 'next') && page.user.id === interaction.user.id

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
        })

        collector.on('collect', async (button) => {
            if (button.customId === 'previous') {
                await (page-=1)
                await button.update({
                    embeds: [this.setEmbed(client, categories[page])],
                    components: [this.setButton(categories, page)],
                })
            }
            if (button.customId === 'next') {
                await (i+=1)
                await button.update({
                    embeds: [this.setEmbed(client, categories[page])],
                    components: [this.setButton(categories, page)],
                })
            }
        })
    },

    setEmbed: function (client, page) {
        const queue = client.player.GetQueue(guildId)
        const embed = new MessageEmbed()
            .setTitle('**🎶 | Queue:**')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
            .setColor('DARK_GREEN')

        if (!queue || !queue.playing)
            return embed
                .setDescription('**❌ | No music is being played!**')
                .setColor('DARK_RED')

        if (page == null) page = 1
        const pageStart = 10 * (page - 1)
        const pageEnd = pageStart + 10
        const tracks = queue.tracks
            .slice(pageStart, pageEnd)
            .map((track, i) => {
                let pos = i + pageStart + 1
                if (pos == 1)
                    return `\`Now Playing.\` ** | [${track.title} by ${track.channelId}](${track.url})**`
                else
                    return `\`${i + pageStart + 0}.\` ** | [${track.title} by ${
                        track.channelId
                    }](${track.url})**`
            })

        embed
            .setDescription(
                `${tracks.join('\n')}${
                    queue.tracks.length > pageEnd
                        ? `\nand... \`${
                              queue.tracks.length - pageEnd
                          }\` more track(s)`
                        : ''
                }`
            )
            .setColor('DARK_GREEN')

        return embed
    },

    setButton: function (queue, page) {
        let previous = false
        if (page == 0) previous = true
        else previous = false

        let next = true
        if (page == (queue.length/10) - 1) next = true
        else next = false

        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle('PRIMARY')
                .setDisabled(previous),
            new MessageButton()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle('PRIMARY')
                .setDisabled(next)
        )

        return buttons
    },
}
