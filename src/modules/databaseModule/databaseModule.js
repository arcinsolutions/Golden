const { Database } = require("@devsnowflake/quick.db");

const db = new Database(__dirname + "/../../../data/data.db", {
  path: __dirname + "/../../../data",
  table: "ROOT",
});

module.exports = {
  createGuild: function (guildId) {
    return db.set(guildId, {
      musicChannel: "",
      musicChannelEmbed: "",
    });
  },

  getAll: function () {
    return db.all();
  },

  getGuild: function (guildId) {
    return db.get(guildId);
  },

  hasGuild: function (guildId) {
    return db.has(guildId);
  },

  createGuildIfNotExists: function (guildId) {
    if (!module.exports.hasGuild(guildId)) module.exports.createGuild(guildId);
  },

  setGuildChannel: function (guildId, channelId) {
    module.exports.createGuildIfNotExists(guildId);
    return db.set(`${guildId}.musicChannel`, channelId);
  },

  setGuildChannelEmbed: function (guildId, messageId) {
    module.exports.createGuildIfNotExists(guildId);
    return db.set(`${guildId}.musicChannelEmbed`, messageId);
  },

  getGuildChannel: function (guildId) {
    return db.get(`${guildId}.musicChannel`);
  },

  getGuildChannelEmbed: function (guildId) {
    return db.get(`${guildId}.musicChannelEmbed`);
  },

  hasGuildChannel: function (guildId, channelType) {
    return db.get(`${guildId}.musicChannel`) !== "";
  },
};
