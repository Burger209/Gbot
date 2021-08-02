const Command = require('../../../Structures/Command');
const { poll } = require('discord.js-poll');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'Poll command',
			usage: 'Name + Option 1 + Option 2 + etc'
		});
	}
	run(msg, args) {
		poll(msg, args, '+', '#000000');
	}
};