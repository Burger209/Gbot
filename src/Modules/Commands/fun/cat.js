const Command = require('../../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'send a random cat picture'
		});
	}

	async run(msg) {
		let m = await msg.channel.send('Generating...');

		fetch('http://aws.random.cat/meow')
			.then(res => res.json()).then(body => {
				if(!body) return msg.reply('something went wrong');

				let embed = new MessageEmbed()
					.setAuthor(`${this.client.user.username} cat!`, msg.guild.iconURL)
					.setImage(body.file)
					.setTimestamp()
					.setFooter(this.client.user.username.toUpperCase(), this.client.user.displayAvatarURL);

				m.edit(embed);
			});
	}
};