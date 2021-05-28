const { Client } = require('./Structures');
const config = require('../config.js');

const client = new Client(config);
client.start();