const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDefaultPermission(true)
    .setDescription('delete a Specific amount of Messages!')
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Specify the Amount of Messages get deleted!')
        .setRequired(true)
    ),

  async execute (interaction) {
    const amount = interaction.options.getInteger('amount')

    if (amount <= 0) {
      return interaction.reply({content: `the Amount can´t be that small! (Max 100)`, ephemeral: true })
    } else if (amount > 100) {
      return interaction.reply({content: `the Amount can´t be that big! (Max 100)`, ephemeral: true })
    } else {
      await interaction.deferReply({ ephemeral: true })

      try {
        return interaction.channel.messages
          .fetch({ limit: amount })
          .then(messages => {
            // interaction.deferReply({ ephemeral: true })
            interaction.channel.bulkDelete(messages)
            interaction.editReply(`${messages.size} Messages got deleted`)
          })
      } catch (e) {
        interaction.editReply(`${e}`)
      }

      // return interaction.reply(`${amount} Messages got deleted`)
    }
  }
}
