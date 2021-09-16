module.exports = {
	name: 'permissions', 
		execute(interaction, client) {
            if (!client.application.owner) {
                client.application.fetch();
            }

            const command = client.guilds.cache.get('863873035224612944')?.commands.fetch('887937007928606730');
            
            const permissions = [
                {
                    id: '236913933611565057',
                    type: 'USER',
                    permission: true,
                },
            ];
            
            command.permissions.set({ permissions });


            const fullPermissions = [
                {
                    id: '123456789012345678',
                    permissions: [{
                        id: '224617799434108928',
                        type: 'USER',
                        permission: false,
                    }],
                },
            ]
	},
};