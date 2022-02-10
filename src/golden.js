const env = require("dotenv").config({ path: "./data/config.env" });

const Spotify = require("erela.js-spotify");
const { Client, Intents } = require("discord.js");
const { Manager } = require("erela.js");
const { DiscordTogether } = require('discord-together');

const {
  registerCommands,
  registerGenericEvents,
  registerMusicEvents
} = require("./modules/handlerModule/handlerModule");

if (!env.parsed)
  return console.log('Fatal: config.env file missing or unreadable\nSetup instructions at https://github.com/spastenstudio/Golden')

const client = new Client({
  shards: "auto",
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

const plugins = []
if (process.env.SPOTIFY_ENABLED === 'true')
  plugins.push(new Spotify({
    clientID: process.env.SPOTIFY_CLIENTID,
    clientSecret: process.env.SPOTIFY_CLIENTSECRET,
  }))

client.manager = new Manager({
  nodes: [
    {
      host: process.env.LAVALINK_HOST,
      port: Number(process.env.LAVALINK_PORT),
      password: process.env.LAVALINK_PASSWORD,
      retryDelay: 5000,
      secure: process.env.LAVALINK_SSL === "true" ? true : false
    },
  ],
  plugins,
  autoPlay: true,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

client.discordTogether = new DiscordTogether(client);

registerMusicEvents(client);
registerGenericEvents(client);
registerCommands(client);

client.login(process.env.DISCORD_TOKEN);
