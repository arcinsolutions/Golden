const { SlashCommandBuilder } = require('@discordjs/builders')
const { getRandomActivity } = require('../../functions/random')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDefaultPermission(false)
    .setDescription('change the Activity of the Bot!'),

   
  async execute (interaction, client) {
    try {
    getRandomActivity(client)
    } catch(e) {
      console.log(e)
    }
    return interaction.reply('Test!')
  }
}
