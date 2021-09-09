var colors = require('colors/safe');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
            const text =  client.user.tag + ' is Online!';
            var underline = "";

            const stats = [`${client.guilds}`, ``]
        
            for (var i=1; i<= text.length; i++ ) {
                underline += "━";
            }
        
            console.log(colors.green(underline));
            console.log(colors.green.bold(text));
            console.log(colors.green(underline));

            console.log('┏' + "━".repeat(-2+text.length) + '┓');
            console.log('┃ Stats:' + " ".repeat(-9+text.length) + '┃');
            console.log('┃ Guilds:' + stats[1] + " ".repeat(-10+text.length-stats[1].length) + '┃');
        }
    }
