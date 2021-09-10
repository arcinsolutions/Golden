var colors = require('colors/safe');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {

            const imgText = [];
            imgText[0] = ' _____       _     _              _   _                 _ _           ';
            imgText[1] = '|  __ \\     | |   | |            | | | |               | | |          ';
            imgText[2] = '| |  \\/ ___ | | __| | ___ _ __   | |_| | __ _ _ __   __| | | ___ _ __ ';
            imgText[3] = `| | __ / _ \\| |/ _' |/ _ \\ '_ \\  |  _  |/ _' | '_ \\ / _' | |/ _ \\ '__|`;
            imgText[4] = `| |_\\ \\ (_) | | (_| |  __/ | | | | | | | (_| | | | | (_| | |  __/ |   `;
            imgText[5] = `\\_____/\\___/|_|\\__,_|\\___|_| |_| \\_| |_/\\__,_|_| |_|\\__,_|_|\\___|_|`;
            const text =  `${client.user.tag} is Online!`;
            var underline = "";

            const stats = [];
            stats[0] = ` ${client.guilds.cache.size}`;
            stats[1] = ` ${client.users.cache.size}`;
            stats[2] = ` ${client.channels.cache.size}`
            for (var i=1; i<= text.length; i++ ) {
                underline += "═";
            }
            
            for ( i = 0; i < imgText.length; i++) {
                console.log( colors.red(imgText[i]));
            }

            console.log(colors.green('╔' + underline + '╗'));
            console.log('' + colors.green('║' + colors.red.bold(text) + '║'));
            console.log(colors.green('╠' + underline + '╣'));

            console.log(colors.green('║ ') + colors.bold.underline('Stats:') + " ".repeat(-7+text.length) + colors.green('║ '));
            console.log(colors.green('║ ') + ' Guilds:   ' + stats[0] + ' '.repeat(text.length-stats[0].length-12) + colors.green('║ '));
            console.log(colors.green('║ ') + ' Users:    ' + stats[1] + " ".repeat(text.length-stats[1].length-12) + colors.green('║ '));
            console.log(colors.green('║ ') + ' Channels: ' + stats[2] + " ".repeat(text.length-stats[2].length-12) + colors.green('║ '));
            console.log(colors.green('╚' + underline + '╝'));
        }
    }