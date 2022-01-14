const activities = require("../../../data/config.json").activities;
const { getGlobal } = require("../databaseModule/databaseModule");

module.exports = {
  setRandomActivities: async function (client)
  {
    setInterval(() =>
    {
      const activity =
        activities[Math.floor(Math.random() * activities.length)];

      client.guilds.fetch();

      activity.name = activity.name.replace(
        "/guildCacheSize/",
        client.guilds.cache.size
      );
      activity.name = activity.name.replace(
        "/userCacheSize/",
        client.users.cache.size
      );
      activity.name = activity.name.replace(
        "/goldenChannelCount/",
        getGlobal().stats.goldenChannelCount
      );

      client.user.setActivity(`${activity.name}`, {
        type: activity.type,
      });
    }, 60000);
  },
};
