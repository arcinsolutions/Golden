const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = {
  registerGenericEvents: function (client)
  {
    const eventFiles = fs
      .readdirSync(__dirname + "/../../events/generic/")
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles)
    {
      const event = require(`../../events/generic/${file}`);

      if (event.once)
      {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else
      {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  },

  registerMusicEvents: function (client)
  {
    const playerEvents = fs
      .readdirSync(__dirname + "/../../events/music/")
      .filter((file) => file.endsWith(".js"));

    // Finding Eent File in ./events directory
    for (const PlayerEventsFile of playerEvents)
    {
      const event = require(__dirname +
        `/../../events/music/${PlayerEventsFile}`);

      client.manager.on(
        PlayerEventsFile.split(".")[0],
        event.bind(null, client)
      );
    }
  },

  registerCommands: function (client, global)
  {
    // global parameter => register slash commands globally

    const commands = [];
    client.commands = new Collection();

    fs.readdirSync(__dirname + "/../../commands/").forEach((dir) =>
    {
      const commandFiles = fs
        .readdirSync(__dirname + `/../../commands/${dir}/`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles)
      {
        const command = require(`../../commands/${dir}/${file}`);
        // set a new item in the Collection
        // with the key as the command name and the value as the exported module

        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());

        if (command.alias != undefined)
        {
          command.alias.forEach(comm =>
          {
            client.commands.set(comm, command);
            command.data.name = comm;
            commands.push(command.data.toJSON());
          });
        }

      }
    });

    // Deploy commands

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    (async () =>
    {
      const imgText = `
 ██████╗  ██████╗ ██╗     ██████╗ ███████╗███╗   ██╗ 
██╔════╝ ██╔═══██╗██║     ██╔══██╗██╔════╝████╗  ██║ 
██║  ███╗██║   ██║██║     ██║  ██║█████╗  ██╔██╗ ██║ 
██║   ██║██║   ██║██║     ██║  ██║██╔══╝  ██║╚██╗██║ 
╚██████╔╝╚██████╔╝███████╗██████╔╝███████╗██║ ╚████║ 
 ╚═════╝  ╚═════╝ ╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═══╝     v2.0
         ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗
         ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗
         ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝
         ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗
         ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║
         ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
         `;

      console.log(imgText);

      try
      {
        if (!global)
        {
          await rest.put(
            Routes.applicationGuildCommands(
              process.env.APPID,
              process.env.GUILDID
            ),
            {
              body: commands,
            }
          );
        } else
        {
          await rest.put(Routes.applicationCommands(process.env.APPID), {
            body: commands,
          });
        }
        const text = 'Successfully registered slash commands';
        console.log('╭' + '─'.repeat(65) + '╮');
        console.log(
          '│ ' + ' '.repeat((63 - text.length) / 2) +
          text + ' '.repeat((64 - text.length) / 2) +
          ' │'
        );
        console.log('╰' + '─'.repeat(65) + '╯');
      } catch (error)
      {
        console.error(error);
      }
    })();
  },
};
