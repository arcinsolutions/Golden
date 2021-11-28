const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with a nice Menu!'),
    // .addStringOption((option) =>
    //     option
    //         .setName('category')
    //         .setDescription('the Category you want to see the Commands')
    //         .setRequired(false)
    // ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        // const categoryOp = interaction.options.getString('category')
        let i = 0

        const commandsNames = client.commands.map((description) => {
            let temp = {
                Category: description.category,
            }
            return temp
        })

        let categories = []
        commandsNames.forEach((commands) => {
            if (!categories.includes(commands.Category))
                categories.push(commands.Category)
        })

        const embed = this.setEmbed(client, categories[i])
        const buttons = this.setButton(categories, i)

        await interaction.reply({
            embeds: [embed],
            components: [buttons],
            ephemeral: true
        })

        const filter = (i) => i.customId === 'previous' || i.customId === 'next'

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
        })

        collector.on('collect', async (button) => {
            if (button.customId === 'previous') {
                await (i-=1)
                await button.update({
                    embeds: [this.setEmbed(client, categories[i])],
                    components: [this.setButton(categories, i)],
                })
            }
            if (button.customId === 'next') {
                await (i+=1)
                await button.update({
                    embeds: [this.setEmbed(client, categories[i])],
                    components: [this.setButton(categories, i)],
                })
            }
        })
    },

    setEmbed: function (client, category) {
        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
            .setTitle('**Help Menu**')
            .setColor('DARK_GREEN')

        const commandsNames = client.commands.map((description) => {
            let temp = {
                Name: description.data.name,
                Description: description.data.description,
                Category: description.category,
            }
            return temp
        })

        for (var i = 0; i < commandsNames.length; i++) {
            const name = commandsNames[i].Name.toString()
            const description = commandsNames[i].Description.toString()
            if (category == commandsNames[i].Category) {
                embed.addField(`${name}`, `Description: ${description}`, false)
            }
        }

        return embed
    },

    setButton: function(categories, i){
        let previous = false
        if (i == 0) previous = true
        else previous = false

        let next = true
        if (i == categories.length) next = true
        else next = false

        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle('PRIMARY')
                .setDisabled(previous),
            new MessageButton()
                .setCustomId('category')
                .setLabel(`Category: ${categories[i]}`)
                .setStyle('SECONDARY')
                .setDisabled(true),
            new MessageButton()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle('PRIMARY')
                .setDisabled(next)
        )

        return buttons
    }
}
