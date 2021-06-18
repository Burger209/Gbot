const Event = require('../../Structures/Event');
const translate  = require('@vitalets/google-translate-api');

module.exports = class extends Event {
	constructor(...args) {
		super(...args);
	}
	async run(msg) {
		this.client.settings = await this.client.util.getSettings(msg.guild);

		const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

		if (msg.content.match(mentionRegex)) msg.channel.send(`My prefix for ${msg.guild.name} is \`${this.prefix}\`.`);

		if (!msg.guild || msg.author.bot) return;

		let prefix = false;
		for (const i of this.client.prefixes) {
			if (msg.content.match(mentionRegexPrefix)) {
				prefix = msg.content.match(mentionRegexPrefix)[0];
			} else if (msg.content.startsWith(i)) {
				prefix = i;
			}
		}

		// eslint-disable-next-line no-unused-vars
		const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);

		const level = await this.client.level(msg.member);

		if (!msg.content.startsWith(prefix)) {
			if (this.client.settings.autoTranslate) {
				translate(msg.content, { to: this.client.settings.defTranslateLang }).then(res => {
					if (res.from.language.iso !== this.client.settings.defTranslateLang) {
						msg.channel.send(res.text);
					} else {
						return;
					}
				});
			} else {
				return;
			}
		}

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.aliases.get(cmd.toLowerCase());
		if (command && command.level <= level) {
			command.run(msg, args, prefix);
		}
	}
};