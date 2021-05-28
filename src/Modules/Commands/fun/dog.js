const Command = require('../../../Structures/Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: 'send a random dog picture'
		});
	}

	async run(msg) {
		let m = await msg.channel.send('Generating...');

		fetch('https://dog.ceo/api/breeds/image/random')
			.then(res => res.json()).then(body => {
				if(!body) return msg.reply('something went wrong');

				let embed = new MessageEmbed()
					.setAuthor(`${this.client.user.username} dog!`, msg.guild.iconURL)
					.setImage(body.message)
					.setTimestamp()
					.setFooter(this.client.user.username.toUpperCase(), this.client.user.displayAvatarURL);

				m.edit(embed);
			});
	}
};