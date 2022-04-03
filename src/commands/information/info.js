const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getChannelsCreated } = require("../../modules/databaseModule/databaseModule");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("View statistics about Golden"),

    alias: ['i'],
    async execute(interaction, client)
    {
        const embed = new MessageEmbed()
            .setTitle(`about ${client.user.username}`)
            .setDescription('This Bot is a free and open source Discord bot started in 2021 with the goal to provide 24/7, lag free music for you and your friends.')
            .addField('Authors', '<@236913933611565057> and <@534763952010428417>', false)
            .addField('Website', 'Work in Progess <:Golden_wink:944224740745289728>', true)
            .addField('Invite', `[Link](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=274914962448&scope=bot%20applications.commands)`, true)
            .addField('GitHub', '[Link](https://github.com/arcinsolutions/Golden)', true)
            .setColor('GOLD');

        const sent = await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });


    },
};
