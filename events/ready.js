var colors = require('colors/safe');
const fs = require('fs');
const { getRandomActivity } = require('../functions/random');

import('../functions/random.js')

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
            const text =  `  ${client.user.tag} is Online now!  `;
            var underline = [];
            underline[0] = "";
            underline[1] = "";


            var files = [];

            files[1] = fs.readdirSync(`./events/`).filter(file => file.endsWith('.js'));

            const stats = [];
            stats[0] = ` ${client.guilds.cache.size}`;
            stats[1] = ` ${client.users.cache.size}`;
            stats[2] = ` ${client.channels.cache.size}`
            stats[3] = ` ${client.commands.size}`
            stats[4] = ` ${files[1].length}`
            for (var i=1; i<= text.length; i++ ) {
                underline[0] += "─";
                underline[1] += "╴";
            }
            
            console.log(colors.green(`            ╭${underline[0]}╮`));
            console.log('' + colors.green(`            │${colors.red.bold(text)}│`));
            console.log(colors.green('            ├' + underline[0] + '┤'));

            console.log(colors.green('            │ ') + colors.bold.underline('Stats:') + " ".repeat(-7+text.length) + colors.green('│ '));
            console.log(colors.green('            │ ') + ' Guilds:   ' + stats[0] + ' '.repeat(text.length-stats[0].length-12) + colors.green('│ '));
            console.log(colors.green('            │ ') + ' User:     ' + stats[1] + " ".repeat(text.length-stats[1].length-12) + colors.green('│ '));
            console.log(colors.green('            │ ') + ' Channels: ' + stats[2] + " ".repeat(text.length-stats[2].length-12) + colors.green('│ '));
            console.log(colors.green('            ├' + underline[1] + '┤'));
            console.log(colors.green('            │ ') + ' Commands: ' + stats[3] + " ".repeat(text.length-stats[3].length-12) + colors.green('│ '));
            console.log(colors.green('            │ ') + ' Events:   ' + stats[4] + " ".repeat(text.length-stats[4].length-12) + colors.green('│ '));
            console.log(colors.green('            ╰' + underline[0] + '╯'));


            //** ++ Activity ++ */ 

            setInterval(()=>{
                try{
                    getRandomActivity(client)
                }catch (e) {
                  console.log(e);
                }
              }, 10*60*100)

            client.user.setActivity(`${stats[0]} Guilds`, { type: 'LISTENING' });
            
            //** -- Activity -- */
        }
    }

    