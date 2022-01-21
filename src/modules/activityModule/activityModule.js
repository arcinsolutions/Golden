const activities = require("../../../data/config.json").activities;
const { getGlobal } = require("../databaseModule/databaseModule");

module.exports = {
  setRandomActivities: async function (client)
  {
    setInterval(async () =>
    {
      const global = await getGlobal();
      const activity =
        activities[Math.floor(Math.random() * activities.length)];

      client.guilds.fetch();

      client.guilds.cache.forEach(guild =>
      {
        guild.members.fetch();
      });

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
        global.value
      );

      client.user.setActivity(`${activity.name}`, {
        type: activity.type,
      });
    }, 60000);
  },
};
