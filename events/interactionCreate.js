const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const { goldenChannelExistsInGuild, deleteGoldenChannelInsideGuild, createGoldenChannelInsideGuild, populateGoldenChannelInsideGuild } = require('../functions/channel')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        //for Development 😉
        // console.log(`${interaction.user.tag} in #${interaction.channel.name} (${interaction.channel.id}) triggered an interaction (${interaction.commandName}).`);

        const embed = new MessageEmbed()
            .setTimestamp()

        if(!interaction.isButton()) return

        const guild = interaction.guild

        console.log(interaction.message)
   
        switch (interaction.customId) {
            case "deleteGoldenChannelInGuild":
    
                if(goldenChannelExistsInGuild(guild)) // If this guild has an existing channel
                    deleteGoldenChannelInsideGuild(guild) // Delete the current channel
    
                const goldenChannel = await createGoldenChannelInsideGuild(guild)
                populateGoldenChannelInsideGuild(goldenChannel.guild)
    
                interaction.message.edit({
                    embeds: [
                        embed.setDescription(`✅ | I created a new Channel (${goldenChannel})`)
                    ],
                    components: []
                })
                break
    
            case "cancelDeleteGoldenChannelInGuild":
                interaction.message.edit({ 
                    embeds: [
                        embed.setDescription(`✅ | I stay with the current Channel (<#${db.get(interaction.guildId).channel}>)`)
                    ],
                    components: []
                })
                break
        }
    
        return await interaction.deferUpdate()
    },
}
