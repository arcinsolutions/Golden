const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	replyInteractionEmbed,
} = require('../../modules/channelModule/channelModule');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip current song')
		.addIntegerOption((option) =>
			option
				.setName('amount')
				.setDescription('the amount of songs to be skipped')
		)
		.addIntegerOption((option) =>
			option
				.setName('queue_number')
				.setDescription(
					'the Number of the song in the Queue to which you want to Skip'
				)
		),

	async execute(interaction, client) {
		const amount = interaction.options.getInteger('amount');
		const queue_number = interaction.options.getInteger('queue_number');

		const player = interaction.client.manager.get(interaction.guild.id);
		const queue = player.queue;

		if (!player)
			return replyInteractionEmbed(
				interaction,
				'',
				'Play a track before using this command.',
				'DARK_RED'
			);

		const { channel } = interaction.member.voice;
		if (!channel)
			return replyInteractionEmbed(
				interaction,
				'',
				'Join a voice channel first.',
				'DARK_RED'
			);
		if (channel.id !== player.voiceChannel)
			return replyInteractionEmbed(
				interaction,
				'',
				"I've to be in the same voice channel with you for requesting tracks.",
				'DARK_RED'
			);

		if (!player.queue.current)
			return replyInteractionEmbed(
				interaction,
				'',
				'There is no music playing.',
				'DARK_RED'
			);

		const { title } = player.queue.current;

		if (amount != undefined) {
			if (player.queue.totalSize < amount)
				return replyInteractionEmbed(
					interaction,
					'',
					`Queue is not that Big, please use a smaller Number.`,
					'DARK_RED'
				);

			await queue.remove(0, amount);
			await player.stop();

			return replyInteractionEmbed(
				interaction,
				'Songs were skipped',
				`Now Playing ${queue.current.title}`,
				'DARK_GREEN'
			);
		} else if (queue_number != undefined) {
			if (player.queue.totalSize < queue_number)
				return replyInteractionEmbed(
					interaction,
					'',
					`Queue is not that Big, please use a smaller Number.`,
					'DARK_RED'
				);

			await queue.remove(0, queue_number - 1);
			await player.stop();

			return replyInteractionEmbed(
				interaction,
				'Songs were skipped',
				`Now Playing ${queue.current.title}`,
				'DARK_GREEN'
			);
		}

		player.stop();
		return replyInteractionEmbed(
			interaction,
			'',
			`${title} was skipped.`,
			'DARK_GREEN'
		);
	},
};
