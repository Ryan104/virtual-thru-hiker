// Model for the trailmarks //

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrailmarkSchema = new Schema({
	name: String,
	type: String,
	location: {
		lat: Number, 
		lon: Number
	},
	toStart: Number,
	toEnd: Number,
	elevation: String,
});

module.exports = mongoose.model('Trailmark', TrailmarkSchema);
