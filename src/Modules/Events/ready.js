const Event = require('../../Structures/Event');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true
		});
	}
	async run() {
		const str = this.client.prefixes.toString();
		this.client.user.setActivity(`Prefixes: ${str.split(',').join(' ')}`);

		console.log(`Guilds: ${this.client.guilds.cache.size}`);
		console.log(`Users: ${this.client.users.cache.size}`);
		console.log('im online');
		
		this.client.util.mongo();
		this.client.music.init(this.client.user.id);
	}
};