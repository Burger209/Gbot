const Command = require('../../../Structures/Command');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			level: 10
		});
	}
	run(msg, args) {
		try {
			const code = args.join(' ');
			let evaled = eval(code);
  
			if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

			msg.channel.send(clean(evaled), {code:'js'}).then(m => m.delete({ timeout: 5000 }));
		} catch (err) {
			msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``).then(m => m.delete({ timeout: 5000 }));
		}
	}
};

const clean = text => {
	if (typeof(text) === 'string') {
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	} else {
		return text;
	}
}; 

