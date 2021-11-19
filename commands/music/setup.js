const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')
const {
    createGoldenChannelInsideGuild,
    populateGoldenChannelInsideGuild,
    goldenChannelExistsInGuild,
    populateGoldenChannelPlayerInsideGuild,
} = require('../../functions/channel')
const { MessageActionRow, MessageButton } = require('discord.js')

const deleteGoldenChannelComponents = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('deleteGoldenChannelInGuild')
            .setLabel('Yeah, go for it')
            .setStyle('DANGER')
    )
    .addComponents(
        new MessageButton()
            .setCustomId('cancelDeleteGoldenChannelInGuild')
            .setLabel("Nah, I'm fine")
            .setStyle('SUCCESS')
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the music channel'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply({
            ephemeral: true,
        })

        const embed = new MessageEmbed()
            .setTimestamp()

        const guild = interaction.guild

        if (goldenChannelExistsInGuild(guild))
            // If guild exists in database and its music channel id exists
            return interaction.editReply({
                embeds: [
                    embed
                        .setDescription(
                            `**❌ | I already have an Channel (<#${
                                client.db.get(guild.id).channel
                            }>)**\nshould i delete the Current one and replace it with a new one?`
                        )
                        .setColor('DARK_ORANGE'),
                ],
                components: [deleteGoldenChannelComponents],
            })

        const goldenChannel = await createGoldenChannelInsideGuild(guild)
        await populateGoldenChannelInsideGuild(guild)
        await populateGoldenChannelPlayerInsideGuild(guild, client)

        return interaction.editReply(`OK CHANNEL_CREATED ${goldenChannel}`)
    },
}
