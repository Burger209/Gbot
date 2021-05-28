module.exports = class Command {
	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description provided';
		this.usage = options.usage || 'No usage provided';
		this.level = options.level || 0;
		this.category = null;
	}

	run() {
		throw new TypeError(`${this.name} Is missing run parameter`);
	}
};