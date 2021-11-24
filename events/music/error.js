const { MessageEmbed } = require('discord.js')
const { sleep } = require('../../functions/random')

module.exports =
    ('error',
    (client, message, queue, data) => {
        if (queue && queue.message) {
            const Embed = new MessageEmbed()
                .setTitle('Music Player')
                .setDescription(
                    `❌ **ERROR | Please open a Ticket on our Support Server.**`
                )
                .setColor('DARK_RED')
            console.log(`Err | ${message}`)
            const msg = queue.message.channel.send({ embeds: [Embed] })
            sleep(10000)
            console.log(msg)
        }
        return console.log(`Err | ${message}`)
    })
