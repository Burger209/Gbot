const Event = require('../../Structures/Event');

module.exports = class extends Event {
	constructor(...args) {
		super(...args);
	}
	run(d) {
		this.client.music.updateVoiceState(d);
	}
};