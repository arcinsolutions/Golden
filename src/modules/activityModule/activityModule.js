const { getChannelsCreated } = require("../databaseModule/databaseModule");

const activities = [
      {
          "name": "/guildCacheSize/ Servers",
          "type": "LISTENING"
        },
        {
          "name": "with /userCacheSize/ Members",
          "type": "PLAYING"
        },
        {
          "name": "/goldenChannelsCreated/ music channels",
          "type": "LISTENING"
        }
  ]

module.exports = {
  setRandomActivities: async function (client)
  {
    setInterval(async () =>
    {
      const channelsCreated = await getChannelsCreated();
      const activity =
        activities[Math.floor(Math.random() * activities.length)];

      activity.name = activity.name.replace(
        "/guildCacheSize/",
        client.guilds.cache.size
      );
      activity.name = activity.name.replace(
        "/userCacheSize/",
        client.guilds.cache.map((g) => g.memberCount).reduce((a, c) => a + c)
      );
      activity.name = activity.name.replace(
        "/goldenChannelsCreated/",
        channelsCreated.value
      );

      client.user.setActivity(`${activity.name}`, {
        type: activity.type,
      });
    }, 60000);
  },
};
