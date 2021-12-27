const {
	hasGuildChannel,
	getGuildChannel,
	getGuildChannelEmbed,
} = require('../databaseModule/databaseModule');

const {
	channelHeader,
	channelEmbedThumbnail,
	embedNoSongPlayingTitle,
	embedDescription,
	embedEmptyQueue,
} = require('../../../data/config.json');
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

		const channelHero = await channel.send(channelHeader);

		const channelControlComponent = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('playpause')
					.setEmoji('⏯')
					.setStyle('SECONDARY')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('stop')
					.setEmoji('⏹')
					.setStyle('SECONDARY')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('skip')
					.setEmoji('⏭')
					.setStyle('SECONDARY')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('shuffle')
					.setEmoji('🔀')
					.setStyle('SECONDARY')
			)
			.addComponents(
				new MessageButton()
					.setLabel('Source')
					.setStyle('LINK')
					.setURL('https://golden.spasten.studio/')
					.setDisabled(true)
			);

		const channelEmbed = new MessageEmbed()
			.setColor('DARK_BUT_NOT_BLACK')
			.setTitle(embedNoSongPlayingTitle)
			.setDescription(embedDescription)
			.setImage(channelEmbedThumbnail)
			.setFooter(`0 songs in queue | Volume: 100%  | Loop: Disabled`);

		const channelEmbedMessage = await channel
			.send({
				content: embedEmptyQueue,
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
			hasGuildChannel(guildId) &&
			guild.channels.cache.get(getGuildChannel(guildId)) !== undefined
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
							'RED',
							'https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png'
						),
					],
				}); // e.g. embed was removed from message manually

			const duration = player.queue.current.isStream
				? 'LIVE'
				: format(player.queue.current.duration);

			channelEmbed.embeds[0].title = `🎶 | Now playing: ${player.queue.current.title} by ${player.queue.current.author} [${duration}]`;

			const currComponents = channelEmbed.components[0];
			if (currComponents !== undefined) {
				if (player.queue.current.uri !== '') {
					for (const button of currComponents.components) {
						if (button.style === 'LINK') {
							button.disabled = false;
							button.url = player.queue.current.uri;
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
				channelEmbed.embeds[0].image.url = channelEmbedThumbnail;
			} else {
				let trackThumbnail = await player.queue.current.displayThumbnail("maxresdefault");
				const checkedLinks = await checkLinks([trackThumbnail]);

				if(checkedLinks[trackThumbnail].status === "dead") // there is no maxres thumbnail
					trackThumbnail = await player.queue.current.displayThumbnail("hqdefault"); // use a lower quality res one instead

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
							'RED',
							'https://cdn.discordapp.com/attachments/922836431045525525/922841155098533928/warn.png'
						),
					],
				}); // e.g. embed was removed from message manually

			channelEmbed.embeds[0].title = embedNoSongPlayingTitle;

			const currComponents = channelEmbed.components[0];
			for (const button of currComponents.components) {
				if (button.style === 'LINK') {
					button.disabled = true;
					button.url = 'https://golden.spasten.studio';
				}
			}

			channelEmbed.embeds[0].image = { url: channelEmbedThumbnail };
			channelEmbed.embeds[0].footer = {
				text: `0 songs in queue | Volume: ${volume}% | Loop: Disabled`,
			};

			channelEmbed.edit({
				content: embedEmptyQueue,
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
		thumbnailUrl,
		ephemeral
	) {
		if (ephemeral == null) ephemeral = false;

		if (interaction.channel.id === getGuildChannel(interaction.guild.id)) {
			await interaction.reply({
				embeds: [createEmbed(title, description, color, thumbnailUrl)],
				ephemeral: ephemeral,
			});
			setTimeout(() => interaction.deleteReply().catch((e) => {}), 10000);
		} else {
			await interaction.reply({
				embeds: [createEmbed(title, description, color, thumbnailUrl)],
				ephemeral: true,
			});
		}
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
		if (queue.length < 1) return embedEmptyQueue;

		let contentLength = 0;
		const formattedQueueArray = [];

		for (var i = 0; i <= queue.length; i++) {
			const track = queue[i];
			let index = i;

			if (track === undefined) continue;
			contentLength += track.title.length;

			if(contentLength > 450) {
				formattedQueueArray.push(`\nAnd **${queue.length - i}** more tracks`);
				formattedQueueArray.push('\n__**Queue:**__');
				return formattedQueueArray.reverse().join('');
			}

			const duration = track.isStream ? 'LIVE' : format(track.duration);
			formattedQueueArray.push(
				`\n${++index}. ${track.title} by ${track.author} [${duration}]`
			);
		}

		formattedQueueArray.push('\n__**Queue:**__');
		return formattedQueueArray.reverse().join('');
	},

	generateProgressBar: function (ms, duration) {
		const part = Math.floor((ms / duration) * 10);
		return '═'.repeat(part) + '🟢' + '═'.repeat(10 - part);
	},
};
