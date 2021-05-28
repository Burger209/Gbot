require('dotenv').config();

module.exports = {
	ownerId: process.env.OWNERID,
	token: process.env.TOKEN,
	prefixes: [...process.env.PREFIXES.split(',')],
	mongoURL: process.env.MONGOURL,
	defaultSettings: {
		modLogs: 'none',
		modRole: 'none',
		adminRole: 'none'
	},
	nodes: [{
		host: 'lava',
		port: 2333,
		password: 'password'
	}]
};
