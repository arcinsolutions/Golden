require("dotenv").config({ path: "./data/.env" });

const Spotify = require("erela.js-spotify");
const { Client, Intents } = require("discord.js");
const { Manager } = require("erela.js");
const { DiscordTogether } = require('discord-together');

const {
  registerCommands,
  registerGenericEvents,
  registerMusicEvents
} = require("./modules/handlerModule/handlerModule");

const client = new Client({
  fetchAllMembers: true,
  shards: "auto",
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.manager = new Manager({
  nodes: [
    {
      host: process.env.LL_HOST,
      port: Number(process.env.LL_PORT),
      password: process.env.LL_PASSWORD,
      retryDelay: 5000,
      secure: process.env.LL_SECURE === "true" ? true : false
    },
  ],
  /*plugins: [
    new Spotify({
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
    }),
  ],*/
  autoPlay: true,
  send: (id, payload) =>
  {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

client.discordTogether = new DiscordTogether(client);

registerMusicEvents(client);
registerGenericEvents(client);
registerCommands(client, false);

client.login(process.env.TOKEN);
