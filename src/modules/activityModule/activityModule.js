const wait = require("util").promisify(setTimeout);
const activities = require("../../../data/config.json").activities;
const { getGlobal } = require("../databaseModule/databaseModule");

module.exports = {
  setRandomActivities: async function (client)
  {
    // console.log(client.guilds.cache);
    setInterval(() =>
    {
      const activity =
        activities[Math.floor(Math.random() * activities.length)];

      let totalMembers = 0;

      client.guilds.cache.forEach(guild => {
        totalMembers += guild.memberCount
      });
      client.guilds.fetch();

      activity.name = activity.name.replace(
        "/guildCacheSize/",
        client.guilds.cache.size
      );
      activity.name = activity.name.replace(
        "/userCacheSize/",
        totalMembers
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
