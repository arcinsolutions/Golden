const permissions = [
  "READ_MESSAGE_HISTORY",
  "MANAGE_CHANNELS",
  "SEND_MESSAGES",
  "EMBED_LINKS",
  "USE_EXTERNAL_EMOJIS",
  "CONNECT",
  "SPEAK",
  "USE_VAD",
];

module.exports = {
    checkPermissions: function(interaction) {

        const missingPermissions = [];
        for(const perm of permissions) {
            if(!interaction.guild.me.permissions.has(perm))
                missingPermissions.push(perm);
        }

        return missingPermissions;
    }
};
