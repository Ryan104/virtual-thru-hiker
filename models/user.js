const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Goal = new Schema({
	start: {
		date: { type: Date, default: Date.now },
		distance: Number
	},
	target: {
		name: String,
		date: Date,
		distance: Number
	},
	complete: String // true, false, in-progress
});

const User = new Schema({
	profile: {
		name: String,
		email: String,
		image: String,
		startDate: { type: Date, default: Date.now }
	},
	google: {
		id: { type: Number, required: true },
		accessToken: String
	},
	fitData: {
		lastUpdate: Date, // time of last update from fit API
		totalSteps: { type: Number, default: 0 },
		totalDistance: { type: Number, default: 0 } // distance in miles (calc from steps)
	},
	goals: [Goal]
});

module.exports = User;