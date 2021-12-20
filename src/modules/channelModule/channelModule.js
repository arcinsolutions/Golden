const {
  hasGuildChannel,
  getGuildChannel,
  getGuildChannelEmbed,
} = require("../databaseModule/databaseModule");

const {
  channelHeader,
  channelEmbedThumbnail,
  embedNoSongPlayingTitle,
  embedDescription,
  embedEmptyQueue,
} = require("../../../data/config.json");

const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
const format = require("format-duration");

module.exports = {
  createChannel: async function (guild) {
    const channel = await guild.channels.create("golden-song-requests", {
      type: "text",
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          allow: ["VIEW_CHANNEL"],
        },
      ],
    });

    return channel;
  },

  populateChannel: async function (guild) {
    const guildId = guild.id;
    const channelId = await getGuildChannel(guildId);
    const channel = await guild.channels.cache.get(channelId);

    await channel.send(channelHeader);

    const channelControlComponent = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("playpause")
          .setEmoji("⏯")
          .setStyle("SECONDARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("stop")
          .setEmoji("⏹")
          .setStyle("SECONDARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("skip")
          .setEmoji("⏭")
          .setStyle("SECONDARY")
      )
      .addComponents(
        new MessageButton()
          .setLabel("Source")
          .setStyle("LINK")
          .setURL("https://golden.spasten.studio/")
          .setDisabled(true)
      );

    const channelEmbed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setTitle(embedNoSongPlayingTitle)
      .setDescription(embedDescription)
      .setImage(channelEmbedThumbnail)
      .setFooter(`0 songs in queue | Volume: 100%`);

    const channelEmbedMessage = await channel.send({
      content: embedEmptyQueue,
      embeds: [channelEmbed],
      components: [channelControlComponent],
    });

    return channelEmbedMessage;
  },

  deleteChannel: async function (guild) {
    const guildId = guild.id;
    const channelId = await getGuildChannel(guildId);
    const channel = await guild.channels.cache.get(channelId);

    return channel.delete();
  },

  channelExists: async function (guild) {
    const guildId = guild.id;
    return (
      hasGuildChannel(guildId) &&
      guild.channels.cache.get(getGuildChannel(guildId)) !== undefined
    );
  },

  channelEmbedExists: async function (guildId, client) {
    const embedMessageId = await getGuildChannelEmbed(guildId);
    const channelId = await getGuildChannel(guildId);
    const channel = client.channels.cache.get(channelId);

    if (channel === undefined) return false;
    return (
      (await channel.messages.fetch(embedMessageId).catch((e) => {})) !==
      undefined
    );
  },

  setEmbed: async function (
    guild,
    title,
    url,
    queue,
    thumbnail,
    queueLength,
    volume
  ) {
    if (await module.exports.channelExists(guild)) {
      const channelId = await getGuildChannel(guild.id); // ID of the golden channel for this guild
      const channelEmbedId = await getGuildChannelEmbed(guild.id); // ID of the player Embed inside the golden channel

      const channel = await guild.channels.cache.get(channelId); // Fetched channel
      const channelEmbed = await channel.messages.fetch(channelEmbedId); // Fetched player embed

      if (channelEmbed.embeds[0] === undefined)
        return channel.send(
          "Sorry but it seems like the channel is broken. Please create a new one!"
        ); // e.g. embed was removed from message manually

      channelEmbed.embeds[0].title = title;

      const currComponents = channelEmbed.components[0];
      if (currComponents !== undefined) {
        if (url !== "") {
          for (const button of currComponents.components) {
            if (button.style === "LINK") {
              button.disabled = false;
              button.url = url;
            }
          }

          //channelEmbed.embeds[0].url = url
        } else {
          for (const button of currComponents.components) {
            if (button.style === "LINK") {
              button.disabled = true;
              button.url = "https://golden.spasten.studio";
            }
          }

          //channelEmbed.embeds[0].url = ""
        }
      }

      if (thumbnail === null) {
        // if there's no thumbnail (e.g. SoundCloud or radio link)
        channelEmbed.embeds[0].image.url = channelEmbedThumbnail;
      } else {
        channelEmbed.embeds[0].image.url = thumbnail;
      }

      channelEmbed.embeds[0].footer = {
        text: `${queueLength} songs in queue | Volume: ${volume}%`,
      };

      channelEmbed.edit({
        content: queue,
        embeds: [new MessageEmbed(channelEmbed.embeds[0])],
        components: [new MessageActionRow(currComponents)],
      });
    }
  },

  updateVolume: async function (guild, queueLength, volume) {
    if (await module.exports.channelExists(guild)) {
      const channelId = await getGuildChannel(guild.id);
      const channelEmbedId = await getGuildChannelEmbed(guild.id);

      const channel = await guild.channels.cache.get(channelId);
      const channelEmbed = await channel.messages.fetch(channelEmbedId);

      if (channelEmbed.embeds[0] === undefined)
        return channel.send(
          "Sorry but it seems like the channel is broken. Please create a new one!"
        ); // e.g. embed was removed from message manually

      channelEmbed.embeds[0].footer = {
        text: `${queueLength} songs in queue | Volume: ${volume}%`,
      };

      channelEmbed.edit({
        embeds: [new MessageEmbed(channelEmbed.embeds[0])],
      });
    }
  },

  resetChannel: async function (guild, volume) {
    if (volume === undefined) volume = 100;
    module.exports.setEmbed(
      guild,
      embedNoSongPlayingTitle,
      "",
      embedEmptyQueue,
      channelEmbedThumbnail,
      0,
      volume
    );
  },

  sendTemporaryMessage: async function (channel, content, time) {
    channel.send(content).then((msg) => {
      setTimeout(() => msg.delete().catch((e) => {}), time);
    });
  },

  generateQueue: function (queue) {
    if (queue.length < 1) return embedEmptyQueue;

    const formattedQueueArray = [];

    for (var i = 0; i <= queue.length; i++) {
      const track = queue[i];
      let index = i;

      if (track === undefined) continue;

      if (i > 25) {
        formattedQueueArray.push(`\n And **${queue.length - i}** more tracks`);
        formattedQueueArray.push("\n__**Queue:**__");
        return formattedQueueArray.reverse().join("");
      }

      const duration = track.isStream ? "LIVE" : format(track.duration);
      formattedQueueArray.push(
        `\n${++index}. ${track.title} by ${track.author} [${duration}]`
      );
    }

    formattedQueueArray.push("\n__**Queue:**__");
    return formattedQueueArray.reverse().join("");
  },
};
