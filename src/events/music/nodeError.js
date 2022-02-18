module.exports = async (client, node, error) => {
	const text = `Node "${node.options.identifier}" encountered an error.`;

	console.log('╭' + '─'.repeat(65) + '╮');
	console.log(
		'│ ' +
			' '.repeat((64 - text.length) / 2) +
			text +
			' '.repeat((63 - text.length) / 2) +
			' │'
	);
	console.log('╰' + '─'.repeat(65) + '╯');

	console.log(`Error: ${error.message}`);
};
