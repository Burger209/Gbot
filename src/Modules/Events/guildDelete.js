const Event = require('../../Structures/Event');

module.exports = class extends Event {
	constructor(...args) {
		super(...args);
	}
	async run(guild) {
		try {
			await this.client.util.deleteSettings(guild);
		} catch (error) {
			console.log(error);
		}
	}
};