const {
  getGuildChannel,
  setGuildChannel,
  setGuildChannelEmbed,
} = require("../../modules/databaseModule/databaseModule");
const {
  createChannel,
  deleteChannel,
  populateChannel,
  generateQueue,
  setEmbed,
} = require("../../modules/channelModule/channelModule");

const {
  playPause,
  stop,
  skip,
} = require("../../modules/musicControllerModule/musicControllerModule");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (interaction.isButton()) {
      switch (interaction.customId) {

        // channel setup components
        case "cancelDeleteChannel":
          return interaction.update({
            content: `Good, I'll stick with the current Channel <#${getGuildChannel(interaction.guild.id)}>`,
            components: [],
          });

        case "deleteChannel":
          await deleteChannel(interaction.guild);

          const channel = await createChannel(interaction.guild);
          await setGuildChannel(interaction.guild.id, channel.id);
          const channelEmbed = await populateChannel(interaction.guild);
          setGuildChannelEmbed(interaction.guild.id, channelEmbed.id);

          client.manager.players.filter(async (item) => {
            if (item.guild !== interaction.guild.id) return;

            const guild = await client.guilds.fetch(item.guild);
            if (guild === undefined) return;
            const formattedQueue = await generateQueue(item.queue);

            setEmbed(
              guild,
              item.queue.current.title,
              item.queue.current.uri,
              formattedQueue,
              item.queue.current.displayThumbnail("maxresdefault"),
              item.queue.length,
              item.volume
            );
          });

          return interaction.update({
            content: `I've created my new channel here ${channel}`,
            components: [],
          });

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
          content: `There was an issue executing the command: \`${error.toString()}\` Please check bots console for more details`,
          ephemeral: true,
        });
      }
    }
  },
};
