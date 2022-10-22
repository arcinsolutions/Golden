const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { replyInteractionEmbed } = require("../../modules/channelModule/channelModule");
const { addReachable } = require("../../modules/databaseModule/databaseModule");
const embedModule = require("../../modules/embedModule/embedModule");
const { createEmbed } = require("../../modules/embedModule/embedModule");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reachable")
        .setDescription("Adds an Check if the Service or Server is reachable!")
        .addStringOption((option) =>
			option
				.setName('title')
				.setDescription('The Title of the Check you want to Add')
                .setRequired(true)
		)
        .addStringOption((option) =>
			option
				.setName('ip')
				.setDescription('The IP-Address of you Choice')
                .setRequired(true)
		)
        .addNumberOption((option) =>
			option
				.setName('port')
				.setDescription('The Port of your Choice')
		),

    async execute(interaction, client)
    {
        if (!interaction.member.permissions.has("MANAGE_CHANNELS"))
            return replyInteractionEmbed(interaction, 'Missing permission', 'You need admin permission to do that.', 'DARK_RED', 'https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png');

        const title = interaction.options.getString('title');
        const ip = interaction.options.getString('ip');
        const port = interaction.options.getNumber('port');

        // if addReachable(interaction.guild.id, message.id, interaction.guild.name)

        await replyInteractionEmbed(interaction, 'Success', '', 'DARK_GREEN');
        const channel = await interaction.guild.channels.cache.get(interaction.channel.id);

        const channelRefreshComponent = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('refresh')
                    .setLabel('Refresh')
					.setStyle('SUCCESS')
			)

        await channel.send({
                embeds: [createEmbed(`Status for ${title}`, '**Online**', 'DARK_GREEN')],
                components: [channelRefreshComponent],
            })
            .catch((e) => { });

    },
};
