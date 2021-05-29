const { Client, Collection } = require('discord.js');
const hd = require('humanize-duration');
const { Manager } = require('erela.js');
const Util = require('./Util');

module.exports = class Gbot extends Client {
	constructor(options = {}) {
		super({
			disableMentions : 'everyone'
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();

		this.util = new Util(this);

	}

	validate(options) {
		if (!options.ownerId) throw new Error('No owner id was provided');
		this.ownerId = options.ownerId;

		if (typeof options !== 'object') throw new TypeError('Options need to be a object');

		if (!options.token) throw new Error('No Token for the client');
		this.token = options.token;

		if (!options.prefixes) throw new Error('No prefixes where selected');
		if (!Array.isArray(options.prefixes)) throw new TypeError('Prefixes must be an array');
		options.prefixes.forEach(prefix => {
			if (typeof prefix !== 'string') throw new TypeError('Prefix must be a string');
		});
		this.prefixes = options.prefixes;

		if (typeof options.mongoURL !== 'string') throw new TypeError('Mongo url must be a string');
		this.mongoURL = options.mongoURL;

		if (typeof options.defaultSettings !== 'object') throw new TypeError('Default Settings must be in a object.');
		this.defaultSettings = options.defaultSettings;

		if (!options.nodes) throw new Error('No Lavalink settings was provided');
		this.nodes = options.nodes;
	}

	start(token = this.token) {
		super.login(token);

		const client = this;
		client.music = new Manager({
			nodes: client.nodes,
			send(id, payload) {
				const guild = client.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			}
		})
			.on('nodeConnect', node => console.log(`Node ${node.options.identifier} connected`))
			.on('nodeError', (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
			.on('trackStart', ({textChannel}, {title, duration}) => {
				client.channels.cache.get(textChannel).send(`Now playing: **${title}** Duration: \`${hd(duration, {units: ['h', 'm', 's']})}\``);
			})
			.on('queueEnd', player => {
				player.destroy();
				player.disconnect();
			});

		this.util.load();
	}

	level(member) {
		let lvl = 0;

		if (member.id === this.ownerId) {
			lvl = 10;
		} else if (member.guild.ownerID === member.id) {
			lvl = 9;
		} else if (member.roles.cache.has(this.settings.adminRole) || member.hasPermission('ADMINISTRATOR')) {
			lvl = 5;
		} else if (member.roles.cache.has(this.settings.modRole)) {
			lvl = 2;
		}

		return lvl;
	}
};