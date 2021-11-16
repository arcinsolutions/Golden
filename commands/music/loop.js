const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('let you change if the Song or Queue should be Looped!')
        .addStringOption((option) =>
        option
            .setName('page')
            .setDescription('the Queue Page')
            .setRequired(false)
            .addChoice('Song', 'song')
            .addChoice('Queue', 'queue')
    ),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        await interaction.deferReply()

        const embed = new MessageEmbed()
            .setColor('DARK_GREEN')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        var page = interaction.options.getString('page')

        const queue = client.player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return void interaction.editReply({ content: '❌ | No music is being played!' });
        if (!page) page = 1;
        const pageStart = 10 * (page - 1);
        const pageEnd = pageStart + 10;
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
            return `\`${i + pageStart + 1}.\` ** | [${m.title} by ${m.author}](${m.url})**`;
        });


        return void interaction.editReply({
            embeds: [
                embed
                    .setDescription(`${tracks.join('\n')}${
                        queue.tracks.length > pageEnd
                            ? `\n...${queue.tracks.length - pageEnd} more track(s)`
                            : ''
                    }`)
                    .addFields([{ name: 'Now Playing', value: `🎶 **|** **[${currentTrack.title} by ${currentTrack.author}](${currentTrack.url})**`}])
                
            ]
        });
    },
}
