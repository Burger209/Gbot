const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const db = require('mongoose');
const { Settings } = require('../Models');
const Command = require('./Command');
const Event = require('./Event');

module.exports = class Util {
	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' &&
		typeof input.prototype === 'object' &&
		input.toString().substring(0, 5) === 'class';
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	load() {
		glob(`${this.directory}Modules/**/*.js`).then(files => {
			for (const nodeFile of files) {
				delete require.cache[nodeFile];
				const { name, dir } = path.parse(nodeFile);
				const category = dir.split('/').pop();
				const file = require(nodeFile);
				if (!this.isClass(file)) throw new TypeError(`${name} Must contain a class`);
				const node = new file(this.client, name);
				if (node instanceof Command) {
					this.loadCommand(node, category);
				} else if (node instanceof Event) {
					this.loadEvent(node);
				}
			}
		});
	}

	loadCommand(command, category) {
		command.category = category;
		console.log(`Loaded Command: ${command.name.toLowerCase()}.js`);
		this.client.commands.set(command.name.toLowerCase(), command);
		if (command.aliases) {
			for (const alias of command.aliases) {
				this.client.aliases.set(alias, command);
			}
		}
	}

	loadEvent(event) {
		console.log(`Loaded Event: ${event.name.toLowerCase()}.js`);
		this.client.events.set(event.name, event);
		event.emitter[event.type](event.name, (...args) => event.run(...args));
	}

	mongo() {
		db.connect(this.client.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
			.then(() => console.log('Mongo Connected'))
			.catch(err => console.log(err));
	}

	async createSettings(data) {
		if (typeof data !== 'object') data = {};
		const defaults = Object.assign({ _id: db.Types.ObjectId()}, this.client.defaultSettings);
		const merged = Object.assign(defaults, data);

		const newSettings = await new Settings(merged);
		return newSettings.save();
	}

	async getSettings(guild) {
		const data = await Settings.findOne({ guildID: guild.id });
		if (data) {
			return data;
		} else {
			await this.createSettings({ guildID: guild.id });
			return this.getSettings(guild);
		}
	}

	async updateSettings(guild, settings) {
		let data = await this.getSettings(guild);
		if (typeof data !== 'object') data = {};
		for (const key in settings) {
			if (data[key] !== settings[key]) data[key] = settings[key];
			else return;
		}
		return data.updateOne(settings);
	}

	async deleteSettings(guild) {
		let data = await this.getSettings(guild);
		data.deleteOne({ guildID: guild.id }, e => {
			if (e) console.log(e);
			console.log(`Deleted guild(${guild.id})`);
		});
	}
};