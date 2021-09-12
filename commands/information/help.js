const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Replies with a nice Menu!'),
  async execute (interaction, client) {
    const commandsCollection = client.commands.map(description => {
      return `${description.data.name} - ${description.data.description}\n` // Hide syntax if empty
    })

    await interaction.reply(commandsCollection.join(''))
  }
}
