require('dotenv').config();

module.exports = {
	ownerId: process.env.OWNERID,
	token: process.env.TOKEN,
	prefixes: [...process.env.PREFIXES.split(',')],
	spotify: {
		clientID: process.env.SCLIENTID,
		clientSecret: process.env.SSECRET
	},
	mongoURL: process.env.MONGOURL,
	defaultSettings: {
		modLogs: 'none',
		modRole: 'none',
		adminRole: 'none',
		autoTranslate: false,
		defTranslateLang: 'en'
	},
	nodes: [{
		host: 'lava',
		port: 2333,
		password: 'password'
	}]
};
