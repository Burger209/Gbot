module.exports = class Event {
	constructor(client, name, options = {}) {
		this.client = client,
		this.name = name;
		this.type = options.once ? 'once' : 'on';
		this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
	} 

	run() {
		throw new TypeError(`${this.name} Dose not have run Parameter`);
	}
};