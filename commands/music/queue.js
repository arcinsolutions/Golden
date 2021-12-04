const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('let you see the current Queue'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true})
        let page = 0

        const guildId = await interaction.guild.id

        await interaction.editReply({
            embeds: [this.QueSetEmbed(client, guildId, page)],
            components: [this.QueSetButtons(client, guildId, page)],
        })


        /** ++ Button Collector ++ */
        const filter = (button) =>
            (button.customId === 'quePrevious' || button.customId === 'queNext') &&
            button.user.id === interaction.user.id && interaction.id === button.message.interaction.id

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
        })
        collector.on('collect', async (button) => {
            switch (button.customId) {
            case 'quePrevious':
                await (page --)
                await button.update({
                    embeds: [this.QueSetEmbed(client, guildId, page)],
                    components: [this.QueSetButtons(client, guildId, page)],
                })
                break

            case 'queNext':
                await (page ++)
                await button.update({
                    embeds: [this.QueSetEmbed(client, guildId, page)],
                    components: [this.QueSetButtons(client, guildId, page)],
                })
                break
            }
        })
        /** -- Button Collector -- */
    },

    QueSetEmbed: function (client, guildId, page) {
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

        if (page <= 0) page = 0
        
        const pageStart = 10 * (page)
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

    QueSetButtons: function (client, guildId, page) {
        const queue = client.player.GetQueue(guildId)

        let previous = false
        if (page <= 0.1) previous = true
        else previous = false

        if (!queue || !queue.playing) return

        let next = true

        // const currPage = (page/10)+1
        const currPage = page++
        if (currPage >= (Math.floor((queue.tracks.length-1)/10))) next = true
        else next = false

        const pages = `Page: ${currPage+1} / ${Math.floor((queue.tracks.length-1)/10)+1}`

        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('quePrevious')
                .setLabel('Previous')
                .setStyle('PRIMARY')
                .setDisabled(previous),
            new MessageButton()
                .setCustomId('quePages')
                .setLabel(pages)
                .setStyle('SUCCESS')
                .setDisabled(true),
            new MessageButton()
                .setCustomId('queNext')
                .setLabel('Next')
                .setStyle('PRIMARY')
                .setDisabled(next)
        )

        return buttons
    },
}
