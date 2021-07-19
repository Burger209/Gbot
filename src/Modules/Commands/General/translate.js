const Command = require('../../../Structures/Command');
const Translate = require('@vitalets/google-translate-api');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['t','tr'],
			description: 'Translate text',
			usage: 'translate <language> <text>'
		});
	}
	async run(msg, args) {
		if (!args[0]) return msg.channel.send('No language to translate to');
		const lang = args[0];
		if (!args[1]) return msg.channel.send('No text was provided');
		const query = args.slice(1).join(' ');

		const translated = await Translate(query, {to: lang});

		msg.channel.send(translated.text);
	}
};