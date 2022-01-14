const { SlashCommandBuilder } = require('@discordjs/builders');
const { replyInteractionEmbed } = require('../../modules/channelModule/channelModule');

const games = [
    ['YouTube', 'youtube'],
    ['Chess', 'chess'],
    ['SpellCast', 'spellcast'],
    ['Doodle Crew', 'doodlecrew'],
    ['Words Snack', 'wordsnack'],
    ['Letter Tile', 'lettertile'],
    ['Fishington', 'fishing'],
    ['Betrayal', 'betrayal'],
    ['Poker', 'poker'],
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("together")
        .setDescription("start a Game session")
        .addStringOption((option) =>
            option
                .setName('option')
                .setDescription('the Game option')
                .setRequired(true)
                .addChoices(games)
        ),
        
    async execute(interaction, client)
    {
        if (interaction.member.voice.channel)
        {
            const option = interaction.options.getString('option');
            client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, option).then(async invite =>
            {
                return interaction.reply(`${invite.code}`);
            });
        } else
        {
            replyInteractionEmbed(interaction, 'ERROR', 'Please join a voice-channel to use this Command!', 'DARK_RED');
        };
    },
};
