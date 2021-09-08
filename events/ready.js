var colors = require('colors/safe');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
            const text =  client.user.tag + ' is Online!';
            var underline = "";
        
            for (var i=1; i<= text.length; i++ ) {
                underline += "▬";
            }
        
            console.log(colors.green(underline));
            console.log(colors.green.bold(text));
            console.log(colors.green(underline));
        }
    }
