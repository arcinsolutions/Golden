var colors = require('colors/safe');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
            const text =  `${client.user.tag} is Online!`;
            var underline = "";

            const stats = [];
            stats[0] = ` ${client.guilds.cache.size}`;
            stats[1] = ` ${client.users.cache.size}`;
            for (var i=1; i<= text.length; i++ ) {
                underline += "━";
            }
            
            console.log(stats[1])

            console.log(colors.green(underline));
            console.log(colors.green.bold(text));
            console.log(colors.green(underline));

            console.log('┏' + "━".repeat(-2+text.length) + '┓');
            console.log('┃ ' + colors.bold.underline('Stats:') + " ".repeat(-9+text.length) + '┃');
            console.log('┃  Guilds:' + stats[0] + ' '.repeat(text.length-stats[0].length-11) + '┃');
            console.log('┃  Users:' + stats[1] + " ".repeat(text.length-stats[0].length-10) + '┃');
        }
    }