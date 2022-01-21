const {
  getGuildChannel,
  setGuildChannel,
  setGuildChannelEmbed,
  setGuildChannelHero,
  increaseChannelCount
} = require("../../modules/databaseModule/databaseModule");
const {
  createChannel,
  deleteChannel,
  populateChannel,
  setEmbed,
  replyInteractionEmbed
} = require("../../modules/channelModule/channelModule");

const {
  playPause,
  stop,
  skip,
  shuffle
} = require("../../modules/musicControllerModule/musicControllerModule");
const { createEmbed } = require("../../modules/embedModule/embedModule");
const { checkPermissions } = require("../../modules/permissionModule/permissionModule")

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {

    const missingPermissions = checkPermissions(interaction);
    if(missingPermissions.length > 0)
      return replyInteractionEmbed(interaction, 'Missing permission', `Golden needs the following permissions in order to work properly:\n\n**${missingPermissions.join(',\n')}** `, 'DARK_RED', 'https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png');

    if (interaction.isButton()) {
      switch (interaction.customId) {

        // channel setup components
        case "cancelDeleteChannel":
          return interaction.update({
            embeds: [createEmbed('Channel creation cancelled', `Okay, I'll stick with my current channel <#${await getGuildChannel(interaction.guild.id)}>`, 'DARKER_GREY', 'https://cdn.discordapp.com/attachments/922836431045525525/922846375312498698/pop.png')],
            components: [],
          });

        case "deleteChannel":
          await deleteChannel(interaction.guild);

          const channel = await createChannel(interaction.guild);
          await setGuildChannel(interaction.guild.id, channel.id, interaction.guild.name);
          const { channelHero, channelEmbed } = await populateChannel(interaction.guild);
          if(channelHero && channelEmbed === undefined) return interaction.deferUpdate();
          setGuildChannelEmbed(interaction.guild.id, channelEmbed.id);
          setGuildChannelHero(interaction.guild.id, channelHero.id);

          client.manager.players.filter(async (player) => {
            if (player.guild !== interaction.guild.id) return;

            const guild = await client.guilds.fetch(player.guild);
            if (guild === undefined) return;

            setEmbed(guild, player);
          });

          increaseChannelCount();
          return interaction.update({
            embeds: [createEmbed('Channel creation successful', `I\'ve created my new channel successfully ${channel}\nJust send any track url or name into the channel and I'll do the rest.`, 'DARK_GREEN', 'https://cdn.discordapp.com/attachments/922836431045525525/922846375312498698/pop.png')],
            components: []
          })

        // music control components
        case "playpause":
          await interaction.deferUpdate();
          playPause(interaction);
          break;

        case "stop":
          await interaction.deferUpdate();
          stop(interaction);
          break;

        case "skip":
          await interaction.deferUpdate();
          skip(interaction);
          break;

        case "shuffle":
          await interaction.deferUpdate();
          shuffle(interaction);
          break;
      }

    } else if (interaction.isCommand()) {

      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply({
          content:
            "Interaction error, couldn't find that Command though.. Please report this error to an developer",
          ephemeral: true,
        });

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `There was an issue executing the command: \`${error.toString()}\` Please report this error to an developer`,
          ephemeral: true,
        });
      }
    }
  },
};
