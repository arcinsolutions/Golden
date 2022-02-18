const {
	guildExists,
	getGuildChannel,
	getGuildChannelEmbed,
} = require('../databaseModule/databaseModule');

const { createEmbed } = require('../embedModule/embedModule');

const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const format = require('format-duration');
const checkLinks = require('check-links');

module.exports = {
	createChannel: async function (guild) {
		const channel = await guild.channels.create('golden-song-requests', {
			type: 'text',
			permissionOverwrites: [
				{
					id: guild.roles.everyone,
					allow: ['VIEW_CHANNEL'],
				},
			],
		});

		return channel;
	},

	populateChannel: async function (guild) {
		const guildId = guild.id;
		const channelId = await getGuildChannel(guildId);
		const channel = await guild.channels.cache.get(channelId);

		const channelHero = await channel.send(process.env.GOLDEN_HEADER);

		const channelControlComponent = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('playpause')
					.setEmoji('<:playpause:930535466908934144>')
					.setStyle('SECONDARY')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('stop')
					.setEmoji('<:stop:930538012805333122>')
					.setStyle('SECONDARY')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('skip')
					.setEmoji('<:skip:930535779887874110>')
					.setStyle('SECONDARY')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('shuffle')
					.setEmoji('<:shuffle:930534110185783386>')
					.setStyle('SECONDARY')
			)
			.addComponents(
				new MessageButton()
					.setEmoji('<:youtube:930538416771313755>')
					.setStyle('LINK')
					.setURL('https://golden.spasten.studio/')
					.setDisabled(true)
			);

		const channelEmbed = new MessageEmbed()
			.setColor('DARK_BUT_NOT_BLACK')
			.setTitle(process.env.GOLDEN_EMBED_TITLE)
			.setDescription(process.env.GOLDEN_EMBED_DESCRIPTION)
			.setImage(process.env.GOLDEN_EMBED_THUMBNAIL)
			.setFooter({ text: `0 songs in queue | Volume: 100%  | Loop: Disabled` });

		const channelEmbedMessage = await channel
			.send({
				content: process.env.GOLDEN_EMBED_MESSAGE,
				embeds: [channelEmbed],
				components: [channelControlComponent],
			})
			.catch((e) => {});

		return { channelHero: channelHero, channelEmbed: channelEmbedMessage };
	},

	deleteChannel: async function (guild) {
		const guildId = guild.id;
		const channelId = await getGuildChannel(guildId);
		const channel = await guild.channels.cache.get(channelId);
		if (channel === undefined) return;

		return channel.delete();
	},

	channelExists: async function (guild) {
		const guildId = guild.id;
		return (
			(await guildExists(guildId)) &&
			guild.channels.cache.get(await getGuildChannel(guildId)) !== undefined
		);
	},

	channelEmbedExists: async function (guildId, client) {
		const embedMessageId = await getGuildChannelEmbed(guildId);
		const channelId = await getGuildChannel(guildId);
		const channel = client.channels.cache.get(channelId);

		if (channel === undefined) return false;
		return (
			(await channel.messages.fetch(embedMessageId).catch((e) => {})) !==
			undefined
		);
	},

	setEmbed: async function (guild, player) {
		if (await module.exports.channelExists(guild)) {
			const channelId = await getGuildChannel(guild.id); // ID of the golden channel for this guild
			const channelEmbedId = await getGuildChannelEmbed(guild.id); // ID of the player Embed inside the golden channel

			const channel = await guild.channels.cache.get(channelId); // Fetched channel
			const channelEmbed = await channel.messages.fetch(channelEmbedId); // Fetched player embed

			if (channelEmbed.embeds[0] === undefined)
				return channel.send({
					embeds: [
						createEmbed(
							'Broken channel',
							'Sorry but it seems like the channel is broken. Please create a new one!',
							'DARK_RED',
							'https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png'
						),
					],
				}); // e.g. embed was removed from message manually

			const duration = player.queue.current.isStream
				? 'LIVE'
				: format(player.queue.current.duration);

			let title = player.queue.current.title.includes(
				player.queue.current.author
			)
				? `Now playing: ${player.queue.current.title} [${duration}]`
				: `Now playing: ${player.queue.current.title} by ${player.queue.current.author} [${duration}]`;

			player.get(`autoplay`)
				? (channelEmbed.embeds[0].title = `<:auto:931241431979417661> | ${title}`)
				: (channelEmbed.embeds[0].title = `<:musicnote:930887306045435934> | ${title}`);

			const currComponents = channelEmbed.components[0];
			if (currComponents !== undefined) {
				if (player.queue.current.uri !== '') {
					for (const button of currComponents.components) {
						if (button.style === 'LINK') {
							button.disabled = false;
							button.url = `https://www.youtube.com/watch?v=${player.queue.current.identifier}`;
						}
					}
				} else {
					for (const button of currComponents.components) {
						if (button.style === 'LINK') {
							button.disabled = true;
							button.url = 'https://golden.spasten.studio';
						}
					}
				}
			}

			if (player.queue.current.thumbnail === null) {
				// if there's no thumbnail (e.g. SoundCloud or radio link)
				channelEmbed.embeds[0].image.url = process.env.GOLDEN_EMBED_THUMBNAIL;
			} else {
				if (typeof player.queue.current.resolve == 'function') await player.queue.current.resolve();
				let trackThumbnail = await player.queue.current.displayThumbnail(
					'maxresdefault'
				);
				const checkedLinks = await checkLinks([trackThumbnail]);

				if (checkedLinks[trackThumbnail].status === 'dead')
					// there is no maxres thumbnail
					trackThumbnail = await player.queue.current.displayThumbnail(
						'hqdefault'
					); // use a lower quality res one instead

				channelEmbed.embeds[0].image.url = trackThumbnail;
			}

			const loop = player.trackRepeat
				? 'Track'
				: player.queueRepeat
				? 'Queue'
				: 'Disabled';
			const paused = player.paused ? '| Paused' : '';

			channelEmbed.embeds[0].footer = {
				text: `${player.queue.length} song${
					player.queue.length === 1 ? '' : 's'
				} in queue | Volume: ${player.volume}% | Loop: ${loop} ${paused}`,
			};

			channelEmbed.edit({
				content: module.exports.generateQueue(player.queue),
				embeds: [new MessageEmbed(channelEmbed.embeds[0])],
				components: [new MessageActionRow(currComponents)],
			});
		}
	},

	resetChannel: async function (guild, volume) {
		if (volume === undefined) volume = 100;

		if (await module.exports.channelExists(guild)) {
			const channelId = await getGuildChannel(guild.id); // ID of the golden channel for this guild
			const channelEmbedId = await getGuildChannelEmbed(guild.id); // ID of the player Embed inside the golden channel

			const channel = await guild.channels.cache.get(channelId); // Fetched channel
			const channelEmbed = await channel.messages.fetch(channelEmbedId); // Fetched player embed

			if (channelEmbed.embeds[0] === undefined)
				return channel.send({
					embeds: [
						createEmbed(
							'Broken channel',
							'Sorry but it seems like the channel is broken. Please create a new one!',
							'DARK_RED',
							'https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png'
						),
					],
				}); // e.g. embed was removed from message manually

			channelEmbed.embeds[0].title = process.env.GOLDEN_EMBED_TITLE;

			const currComponents = channelEmbed.components[0];
			for (const button of currComponents.components) {
				if (button.style === 'LINK') {
					button.disabled = true;
					button.url = 'https://golden.spasten.studio';
				}
			}

			channelEmbed.embeds[0].image = {
				url: process.env.GOLDEN_EMBED_THUMBNAIL,
			};
			channelEmbed.embeds[0].footer = {
				text: `0 songs in queue | Volume: ${volume}% | Loop: Disabled`,
			};

			channelEmbed.edit({
				content: process.env.GOLDEN_EMBED_MESSAGE,
				embeds: [new MessageEmbed(channelEmbed.embeds[0])],
				components: [new MessageActionRow(currComponents)],
			});
		}
	},

	sendTemporaryMessage: async function (channel, content, time) {
		channel.send(content).then((msg) => {
			setTimeout(() => msg.delete().catch((e) => {}), time);
		});
	},

	replyInteractionEmbed: async function (
		interaction,
		title,
		description,
		color,
		thumbnailUrl
	) {
		if (interaction.channel.id === getGuildChannel(interaction.guild.id)) {
			await interaction.reply({
				embeds: [createEmbed(title, description, color, thumbnailUrl)],
			});
			setTimeout(() => interaction.deleteReply().catch((e) => {}), 10000);
		} else {
			await interaction.reply({
				embeds: [createEmbed(title, description, color, thumbnailUrl)],
				ephemeral: true,
			});
		}
	},

	replyEphemeralInteractionEmbed: async function (
		interaction,
		title,
		description,
		color,
		thumbnailUrl
	) {
		await interaction.reply({
			embeds: [createEmbed(title, description, color, thumbnailUrl)],
			ephemeral: true,
		});
	},

	replyBtnInteractionEmbed: async function (
		interaction,
		title,
		description,
		color,
		thumbnailUrl,
		buttons
	) {
		await interaction.reply({
			embeds: [createEmbed(title, description, color, thumbnailUrl)],
			components: [buttons],
			ephemeral: true,
		});
	},

	editInteractionEmbed: async function (
		interaction,
		title,
		description,
		color,
		thumbnailUrl
	) {
		interaction.editReply({
			embeds: [createEmbed(title, description, color, thumbnailUrl)],
		});
	},

	editBtnInteractionEmbed: async function (
		interaction,
		title,
		description,
		color,
		thumbnailUrl
	) {
		interaction.editReply({
			embeds: [createEmbed(title, description, color, thumbnailUrl)],
		});
	},

	replyInteractionMessage: async function (interaction, message) {
		if (interaction.channel.id === getGuildChannel(interaction.guild.id)) {
			await interaction.reply(message);
			setTimeout(() => interaction.deleteReply().catch((e) => {}), 10000);
		} else {
			await interaction.reply({ content: message, ephemeral: true });
		}
	},

	generateQueue: function (queue) {
		if (queue.length < 1) return process.env.GOLDEN_EMBED_MESSAGE;

		let contentLength = 0;
		const formattedQueueArray = [];

		for (var i = 0; i <= queue.length; i++) {
			const track = queue[i];
			let index = i;

			if (track === undefined) continue;
			contentLength += track.title.length;

			if (contentLength > 450) {
				formattedQueueArray.push(`\nAnd **${queue.length - i}** more tracks`);
				formattedQueueArray.push('\n__**Queue:**__');
				return formattedQueueArray.reverse().join('');
			}

			const duration = track.isStream ? 'LIVE' : format(track.duration);
			const title = track.title.includes(track.author)
				? `\n${++index}. ${track.title}[${duration}]`
				: `\n${++index}. ${track.title} by ${track.author} [${duration}]`;

			formattedQueueArray.push(title);
		}

		formattedQueueArray.push('\n__**Queue:**__');
		return formattedQueueArray.reverse().join('');
	},

	generateProgressBar: function (ms, duration) {
		const part = Math.floor((ms / duration) * 10);
		return '═'.repeat(part) + '🟢' + '═'.repeat(10 - part);
	},

	countAllListeningMembers: async function (client) {
		let members = 0;
		for (const [guild, playerData] of client.manager.players.entries()) {
			const cachedGuild = await client.guilds.cache.get(guild);
			const channel = await cachedGuild.channels.cache.get(
				playerData.voiceChannel
			);
			members += channel.members.size;

			if (channel.members.has(client.user.id)) members--; // If Golden is already in the music channel: do not count him
		}
		return members;
	},
};
