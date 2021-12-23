const wait = require("util").promisify(setTimeout);
const activities = require("../../../data/config.json").activities;

module.exports = {
  setRandomActivities: async function (client) {

    while (true) {
      const activity =
        activities[Math.floor(Math.random() * activities.length)];

      activity.name = activity.name.replace(
        "/guildCacheSize/",
        client.guilds.cache.size
      );
      activity.name = activity.name.replace(
        "/userCacheSize/",
        client.users.cache.size
      );
      activity.name = activity.name.replace(
        "/channelCacheSize/",
        client.channels.cache.size
      );

      client.user.setActivity(`${activity.name}`, {
        type: activity.type,
      });

      await wait(600000);
    }
  },
};
