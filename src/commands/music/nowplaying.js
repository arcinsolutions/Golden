const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const formatDuration = require("format-duration");
const { replyInteractionEmbed, generateProgressBar, calcMsInTime, editBtnInteractionEmbed, replyBtnInteractionEmbed } = require("../../modules/channelModule/channelModule");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("See what is currently being played"),

	alias: ['np'],
	async execute(interaction, client)
	{
		const player = interaction.client.manager.get(interaction.guild.id);
		if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'DARK_RED');

		return await NPEmbed(interaction, player);
	},
};

async function NPEmbed(interaction, player)
{
	const queue = await player.queue;
	var bar = generateProgressBar(player.position, queue.current.duration);

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
				.setURL('https://www.youtube.com/watch?v=' + queue.current.identifier)
		);

	if (typeof queue.current.resolve == 'function') await queue.current.resolve();
	await replyBtnInteractionEmbed(interaction, '', `<:musicnote:930887306045435934> **Now Playing:** [${queue.current.title} by ${queue.current.author}](${queue.current.uri})\n**Duration:** ${bar} ${formatDuration(player.position)}|${formatDuration(queue.current.duration)}\n**Requested by:** ${queue.current.requester}`, `DARK_GREEN`, queue.current.displayThumbnail("mqdefault"), channelControlComponent);

	const Interval = setInterval(() =>
	{
		const pos = formatDuration(player.position);
		if (queue.current == undefined || interaction == undefined || player.position > (queue.current.duration - 5000))
		{
			editBtnInteractionEmbed(interaction, '', '**Player stopped or its not available anymore!', 'DARK_RED');
			clearInterval(Interval);
			return;
		};
		bar = generateProgressBar(player.position, queue.current.duration);
		editBtnInteractionEmbed(interaction, '', `<:musicnote:930887306045435934> **Now Playing:** [${queue.current.title} by ${queue.current.author}](${queue.current.uri})\n**Duration:** ${bar} ${pos}|${formatDuration(queue.current.duration)}\n**Requested by:** ${queue.current.requester}`, `DARK_GREEN`, queue.current.displayThumbnail("mqdefault"));
	}, 5000);
};