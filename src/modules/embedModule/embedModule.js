const { MessageEmbed } = require('discord.js');

module.exports = {
    createEmbed: function(title, description, color, thumbnailUrl) {
        return new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setThumbnail(thumbnailUrl);
    },
}
