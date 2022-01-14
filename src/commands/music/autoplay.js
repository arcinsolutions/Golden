const { SlashCommandBuilder } = require("@discordjs/builders");
const { replyInteractionEmbed, setEmbed } = require("../../modules/channelModule/channelModule");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoplay")
        .setDescription("Toggles Autoplay on/off"),

    async execute(interaction, client)
    {
        const player = interaction.client.manager.get(interaction.guild.id);
        if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'DARK_RED');

        const channel = interaction.member.voice;
        if (!channel) return replyInteractionEmbed(interaction, '', 'Join a voice channel first.', 'DARK_RED');
        if (channel.channel.id!= player.voiceChannel)
            return replyInteractionEmbed(interaction, '', 'I\'ve to be in the same voice channel with you for toggling Autoplay.', 'DARK_RED');

        player.set(`autoplay`, !player.get(`autoplay`))

        setEmbed(interaction.guild, player);
        return replyInteractionEmbed(interaction, '', `**${player.get(`autoplay`) ? "activated" : "deactivated"}** Autoplay`, 'DARK_GREEN');
    },
};
