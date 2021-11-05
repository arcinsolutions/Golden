const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with a nice Menu!')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription('the Category you want to see the Commands')
                .setRequired(false)
        ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        const commandsNames = client.commands.map((description) => {
            let temp = {
                Name: description.data.name,
                Description: description.data.description,
                Category: description.category,
            }
            return temp
        })

        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()
            .setTitle('**Help Menu**')
            .setColor('DARK_GREEN')

        const categoryOp = interaction.options.getString('category')

        for (var i = 0; i < commandsNames.length; i++) {
            const name = commandsNames[i].Name.toString()
            const description = commandsNames[i].Description.toString()
            const category = commandsNames[i].Category
            if (!categoryOp) {
                embed.addField(
                    `${name}`,
                    `Description: ${description} **|** Category: ${category}`,
                    false
                )
            } else {
                if (category == categoryOp) {
                    embed
                        .setTitle(`Commands with the Category ${category}`)
                        .addField(
                            `${name}`,
                            `Description: ${description}`,
                            false
                        )
                }
            }
        }

        if (embed.fields.length == 0) {
            embed
                .setDescription(
                    '**❌ | No Commands found with that Category!**'
                )
                .setColor('DARK_RED')
        }

        await interaction.reply({
            embeds: [embed],
        })
    },
}
