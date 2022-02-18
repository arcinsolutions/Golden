const { SlashCommandBuilder } = require("@discordjs/builders");
const { setGuildChannel, setGuildChannelEmbed, setGuildChannelHero, increaseChannelsCreated } = require("../../modules/databaseModule/databaseModule");
const {
  createChannel,
  channelExists,
  populateChannel,
  setEmbed,
  replyInteractionEmbed
} = require("../../modules/channelModule/channelModule");
const { createEmbed } = require("../../modules/embedModule/embedModule");
const { MessageActionRow, MessageButton } = require("discord.js");

const setupChannelComponents = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId("deleteChannel")
      .setEmoji("<:golden_redo:922932409157181440>")
      .setLabel("Yeah, go for it")
      .setStyle("DANGER")
  )
  .addComponents(
    new MessageButton()
      .setCustomId("cancelDeleteChannel")
      .setEmoji("<:golden_x:922932409668874290>")
      .setLabel("Nah, I'm fine")
      .setStyle("SECONDARY")
  );

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the music channel"),

  async execute(interaction, client)
  {
    if (!interaction.member.permissions.has("MANAGE_CHANNELS"))
      return replyInteractionEmbed(interaction, 'Missing permission', 'You need admin permission to do that.', 'DARK_RED', 'https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png');

    if (await channelExists(interaction.guild, "MUSIC_CHANNEL"))
    {
      return interaction.reply({
        embeds: [createEmbed('Golden already has a channel', 'It looks like, Golden already has a channel on this Discord server. But if you want, you can create a new one at anytime.', 'RED', 'https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png')],
        components: [setupChannelComponents],
        ephemeral: true
      });
    }

    const channel = await createChannel(interaction.guild);
    await setGuildChannel(interaction.guild.id, channel.id, interaction.guild.name);
    const { channelHero, channelEmbed } = await populateChannel(interaction.guild);
    await setGuildChannelEmbed(interaction.guild.id, channelEmbed.id, interaction.guild.name);
    await setGuildChannelHero(interaction.guild.id, channelHero.id, interaction.guild.name);

    client.manager.players.filter(async player =>
    {
      if (player.guild !== interaction.guild.id) return;

      const guild = await client.guilds.fetch(player.guild);
      if (guild === undefined) return;

      setEmbed(guild, player);
    });

    if (process.env.ANALYTICS_ENABLED)
      increaseChannelsCreated();
    return interaction.reply({
      embeds: [createEmbed('Channel creation successful', `I\'ve created my new channel successfully ${channel}\nJust send any track url or name into the channel and I'll do the rest.`, 'DARK_GREEN', 'https://cdn.discordapp.com/attachments/922836431045525525/922846375312498698/pop.png')],
      ephemeral: true
    });
  },
};
