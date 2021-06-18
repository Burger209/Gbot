const { Schema, model } = require('mongoose');

const settingsSchema = Schema({
	_id: Schema.Types.ObjectId,
	guildID: String,
	modLogs: String,
	modRole: String,
	adminRole: String,
	autoTranslate: Boolean,
	defTranslateLang: String
});

module.exports = model('Settings', settingsSchema);