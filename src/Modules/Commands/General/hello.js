const Command = require('../../../Structures/Command');

module.exports = class extends Command {
	constructor(...args) {
		super(...args);
	}
	run(msg) {
		msg.channel.send('Hello');
	}
};