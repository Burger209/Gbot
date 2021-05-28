const Command = require('../../../Structures/Command');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			aliases: ['h', 'halp'],
		});
	}
	async run(msg, args, prefix) {
		if (!args[0]) {
			const level = await this.client.level(msg.member);
			const myCommands = this.client.commands.filter(c => c.level <= level);
			const cmdName = myCommands.keyArray();

			const longest = cmdName.reduce((long, str) => Math.max(long, str.length), 0);
			let currentCategory = '';
			let output = `= Command List \`use ${prefix}help <commandname> for more details\` =`;

			const sorted = myCommands.array().sort((p, c) => p.category > c.category ? 1 :  p.name > c.name && p.category === c.category ? 1 : -1 );

			sorted.forEach(c => {
				const cat = c.category.toUpperCase();

				if (currentCategory !== cat) {
					output += `\u200b\n== ${cat} ==\n`;
					currentCategory = cat;
				}

				output += `${prefix}${c.name}${' '.repeat(longest - c.name.length)}\n`;

			});

			msg.channel.send(output, {code:'asciidoc', split: { char: '\u200b' }});

		} else {
			let command = args[0];

			if (this.client.commands.has(command)) {
				command = this.client.commands.get(command);
			}

			msg.channel.send(`= ${command.name} = \n${command.description}\nusage:: ${command.usage}\nalises:: ${command.aliases.join(', ')}`, {code:'asciidoc'});
		}
	}
};