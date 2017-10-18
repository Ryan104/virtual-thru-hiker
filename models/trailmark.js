// Model for the trailmarks //

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrailmarkSchema = Schema({
	name: String,
	type: String,
	location: {
		lat: String, 
		lon: String
	},
	toStart: Number,
	toEnd: Number,
	elevation: String,
});

module.exports = mongoose.model('Trailmark', TrailmarkSchema);
