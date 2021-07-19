/* eslint-disable no-case-declarations */
const Command = require('../../../Structures/Command');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			usage: 'settings <setting> <value>',
			level: 9
		});
	}
	async run(msg, args) {
		const update = args.slice(1).join(' ');

		switch (args[0]) {
		case 'modLogs': 
			try {
				const channel = msg.guild.channels.cache.find(c => c.name === update) || msg.mentions.channels.first();
				if (!channel) return msg.channel.send('could not find channel').then(m => m.delete({ timeout: 5000 }));
				await this.client.util.updateSettings(msg.guild, { modLogs: channel.id });
				msg.channel.send(`Updated welcomeChannel to: ${channel}`).then(m => m.delete({ timeout: 5000 }));
			} catch (error) {
				console.error(error);
			}
			break;
		case 'adminRole': 
			try {
				const role = msg.guild.roles.cache.find(r => r.name === update) || msg.mentions.roles.first();
				if (!role) return msg.channel.send('could not find role').then(m => m.delete({ timeout: 5000 }));
				await this.client.util.updateSettings(msg.guild, { adminRole: role.id });
				msg.channel.send(`Updated adminRole to: ${role}`).then(m => m.delete({ timeout: 5000 }));
			} catch (error) {
				console.error(error);
			}
			break;
		case 'modRole': 
			try {
				const role = msg.guild.roles.cache.find(r => r.name === update) || msg.mentions.roles.first();
				if (!role) return msg.channel.send('could not find role').then(m => m.delete({ timeout: 5000 }));
				await this.client.util.updateSettings(msg.guild, { modRole: role.id });
				msg.channel.send(`Updated adminRole to: ${role}`).then(m => m.delete({ timeout: 5000 }));
			} catch (error) {
				console.error(error);
			}
			break;
		default:
			const skip = ['_id', 'guildID', '__v'];
			const values = [];

			Object.entries(this.client.settings._doc)
				.filter(f => {
					if (!skip.some(v => f.includes(v))) {
						const name = f[0].toString();
						const value = f[1].toString();

						values.push(`${name} : ${value}`);
						return values;
					}
				});

			let output = '= Settings List With current Settings =';

			output += `\n\n${values.map(m => `${m}${' '.repeat(m.length)}`).join('\n')}`;

			msg.channel.send(output, {code: 'asciidoc'}).then(m => m.delete({ timeout: 10000 }));
			break;
		}
	}
};