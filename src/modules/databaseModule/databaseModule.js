const { Database } = require("@devsnowflake/quick.db");

const db = new Database(__dirname + "/../../../data/data.db", {
  path: __dirname + "/../../../data",
  table: "ROOT",
});

module.exports = {
  createGuild: function (guildId) {
    return db.set(guildId, {
      musicChannel: "",
      musicChannelHero: "",
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

  setGuildChannelHero: function (guildId, messageId) {
    module.exports.createGuildIfNotExists(guildId);
    return db.set(`${guildId}.musicChannelHero`, messageId);
  },

  getGuildChannel: function (guildId) {
    return db.get(`${guildId}.musicChannel`);
  },

  getGuildChannelEmbed: function (guildId) {
    return db.get(`${guildId}.musicChannelEmbed`);
  },

  getGuildChannelHero: function (guildId) {
    return db.get(`${guildId}.musicChannelHero`);
  },

  hasGuildChannel: function (guildId, channelType) {
    return db.get(`${guildId}.musicChannel`) !== "";
  },

  createGlobalIfNotExist: function() {
    if(!db.get('global'))
      db.set('global', {
        stats: {
          goldenChannelCount: 0
        }
      });
  },

  getGlobal: function() {
    module.exports.createGlobalIfNotExist();
    return db.get('global');
  },

  increaseGlobalChannelCreation: function() {
    module.exports.createGlobalIfNotExist();
    db.set('global.stats.goldenChannelCount', db.get('global.stats.goldenChannelCount')+1);
  }

};
