const Command = require('../../../Structures/Command');

module.exports = class extends Command {
	constructor(...args) {
		super(...args);
	}
	run(msg) {
		const player = this.client.music.players.get(msg.guild.id);

		if (!player) return msg.channel.send('their is currently no queue').then(m => m.delete({ timeout: 5000 }));

		const { channel } = msg.member.voice;

		if (!channel || channel.id !== player.voiceChannel) return msg.channel.send('You need to be in a voice channel to use the stop command').then(m => m.delete({ timeout: 5000 }));

		player.destroy();
		player.disconnect();
		msg.channel.send('stopped music').then(m => m.delete({ timeout: 5000 }));
	}
};