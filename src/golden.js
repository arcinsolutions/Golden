require("dotenv").config({ path: "./data/.env" });

const Spotify = require("erela.js-spotify");
const { Client, Intents } = require("discord.js");
const { Manager } = require("erela.js");

const {
  registerCommands,
  registerGenericEvents,
  registerMusicEvents
} = require("./modules/handlerModule/handlerModule");

const client = new Client({
  shards: "auto",
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.manager = new Manager({
  nodes: [
    {
      host: process.env.HOST,
      port: Number(process.env.PORT),
      password: process.env.PASSWORD,
      retryDelay: 5000,
      secure: Boolean(process.env.SECURE)
    },
  ],
  plugins: [
    new Spotify({
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
    }),
  ],
  autoPlay: true,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

registerMusicEvents(client);
registerGenericEvents(client);
registerCommands(client, false);

client.login(process.env.TOKEN);
