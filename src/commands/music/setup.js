const { SlashCommandBuilder } = require("@discordjs/builders");
const { setGuildChannel, setGuildChannelEmbed } = require("../../modules/databaseModule/databaseModule");
const {
  createChannel,
  channelExists,
  populateChannel,
  setEmbed
} = require("../../modules/channelModule/channelModule");
const { MessageActionRow, MessageButton } = require("discord.js");

const setupChannelComponents = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId("deleteChannel")
      .setLabel("Yeah, go for it")
      .setStyle("DANGER")
  )
  .addComponents(
    new MessageButton()
      .setCustomId("cancelDeleteChannel")
      .setLabel("Nah, I'm fine")
      .setStyle("SUCCESS")
  );

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the music channel"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    const guildId = interaction.guild.id;

    if (await channelExists(guild, "MUSIC_CHANNEL")) {
      return interaction.reply({
        content: "I already have a channel tho",
        components: [setupChannelComponents],
        ephemeral: true,
      });
    }

    const channel = await createChannel(guild);
    await setGuildChannel(guildId, channel.id);
    const channelEmbed = await populateChannel(guild);
    setGuildChannelEmbed(guildId, channelEmbed.id);

    client.manager.players.filter(async item => { 
      if(item.guild !== interaction.guild.id) return;

      const guild = await client.guilds.fetch(item.guild);
      if(guild === undefined) return;
      const formattedQueue = await generateQueue(item.queue);

      setEmbed(guild, item.queue.current.title, item.queue.current.uri, formattedQueue, item.queue.current.displayThumbnail("maxresdefault"), item.queue.length, item.volume)
    });

    return interaction.reply(`I've created my channel here ${channel}`);
  },
};
