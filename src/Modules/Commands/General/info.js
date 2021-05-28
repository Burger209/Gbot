const Command = require('../../../Structures/Command');
const moment = require('moment');
const { version } = require('discord.js');
require('moment-duration-format');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Sends info about the bot'
		});
	}

	run(msg) {
		const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');

		msg.channel.send(`= STATISTICS =
		• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
		• Uptime     :: ${duration}
		• Users      :: ${this.client.users.cache.size.toLocaleString()}
		• Servers    :: ${this.client.guilds.cache.size.toLocaleString()}
		• Discord.js :: v${version}
		• Node       :: ${process.version}`, {code: 'asciidoc'}).then(m => m.delete({ timeout: 5000 }));
	}
};