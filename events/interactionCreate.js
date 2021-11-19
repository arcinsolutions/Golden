const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const { 
    goldenChannelExistsInGuild, 
    deleteGoldenChannelInsideGuild, 
    createGoldenChannelInsideGuild, 
    populateGoldenChannelInsideGuild,
    populateGoldenChannelPlayerInsideGuild
} = require('../functions/channel')
const { skip, playpause, stop } = require('../functions/musicControl')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        //for Development 😉
        // console.log(`${interaction.user.tag} in #${interaction.channel.name} (${interaction.channel.id}) triggered an interaction (${interaction.commandName}).`);

        const embed = new MessageEmbed()
            .setTimestamp()

        if(!interaction.isButton()) return

        const guild = interaction.guild

        // console.log(interaction.message)
   
        switch (interaction.customId) {
            case "deleteGoldenChannelInGuild":
    
                if(goldenChannelExistsInGuild(guild)) // If this guild has an existing channel
                    deleteGoldenChannelInsideGuild(guild) // Delete the current channel
    
                const goldenChannel = await createGoldenChannelInsideGuild(guild)
                await populateGoldenChannelInsideGuild(goldenChannel.guild)
                await populateGoldenChannelPlayerInsideGuild(guild, client)
    
                interaction.update({
                    embeds: [
                        embed.setDescription(`**✅ | I created a new Channel (${goldenChannel})**`).setColor('DARK_GREEN')
                    ],
                    components: []
                })
                break
    
            case "cancelDeleteGoldenChannelInGuild":
                interaction.update({ 
                    embeds: [
                        embed.setDescription(`**✅ | I stay with the current Channel (<#${db.get(interaction.guildId).channel}>)**`).setColor('DARK_GREEN')
                    ],
                    components: []
                })
                break

            case "skip":
                // PLAYER SKIP LOGIC
                await interaction.deferUpdate()
                skip(interaction, client)
            break

            case "playpause":
                await interaction.deferUpdate()
                playpause(interaction, client)
            break

            case "stop":
                await interaction.deferUpdate()
                stop(interaction, client)
            break
        }
    },
}
