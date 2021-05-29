/* eslint-disable no-case-declarations */
const Command = require('../../../Structures/Command');
const hd = require('humanize-duration');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args);
	}
	run(msg, args) {
		const { channel } = msg.member.voice;

		if (!channel) return msg.channel.send('You need to be in a voice channel to play music').then(m => m.delete({ timeout: 5000 }));

		if (!args[0]) return msg.channel.send('you did not include a song name or link').then(m => m.delete({ timeout: 5000 }));

		const player = this.client.music.create({
			guild: msg.guild.id,
			textChannel: msg.channel.id,
			voiceChannel: channel.id
		});
		if (!player.playing) player.connect();

		this.client.music.search(args.join(' '), msg.author).then(async res => {
			switch (res.loadType) {
			case 'TRACK_LOADED':
				player.queue.add(res.tracks[0]);
				msg.channel.send(`Added to queue: ${res.tracks[0].title}, Duration: \`${hd(res.tracks[0].duration, {units: ['h', 'm', 's']})}\``).then(m => m.delete({ timeout: 5000 }));
				if (!player.playing) player.play();
				break;
			case 'SEARCH_RESULT': 
				let index = 1; 
				const tracks = res.tracks.slice(0, 5);
				
				const embed = new MessageEmbed()
					.setAuthor('Song Select')
					.setDescription(tracks.map(video => `**${index++} -** ${video.title}`))
					.setFooter('Pleas pick a song in 30 seconds. type cancel to cancel the request');
				
				const mssg = await msg.channel.send(embed);
				const collector = msg.channel.createMessageCollector(m => {
					return m.author.id === msg.author.id && new RegExp('^([1-5]|cancel)$', 'i').test(m.content);

				}, { time: 30000, max: 1 });

				collector.on('collect', m => {
					if (/cancel/i.test(m.content)) return collector.stop('cancelled');

					const track = tracks[Number(m.content) - 1];
					player.queue.add(track);
					msg.channel.send(`Added to queue: ${track.title}, Duration: \`${hd(track.duration, {units: ['h', 'm', 's']})}\``).then(m => m.delete({ timeout: 5000 }));
					if (!player.playing) player.play();
				});

				collector.on('end', (_, reason) => {
					if (['time', 'cancelled'].includes(reason)) return msg.channel.send('Cancelled selection').then(m => m.delete({ timeout: 5000 }));
					mssg.delete({ timeout: 1000 });
				});
				break;

			case 'PLAYLIST_LOADED':
				res.playlist.tracks.forEach(track => player.queue.add(track));
				const duration = res.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration}));
				msg.channel.send(`Added to queue \`${res.playlist.tracks.length}\` \`${hd(duration, {units: ['h', 'm', 's']})}\` tracks in playlist \`${res.playlist.info.name}\``).then(m => m.delete({ timeout: 5000 }));
				if (!player.playing) player.play();
				break;
			}
		}).catch(err => console.error(err));
	}
};