const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Goal = new Schema({

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



/*
USER
GoogleId: (google)
accessToken: google
Name: String (google)
Email: String (google)
Start Date: Date (default Date.now())
Total Steps: number
Last Update: Date
Personal Goals: Embeded Goals Model (Mongo IDs)

Method:
Calculate miles: from steps

GOAL
Date Created: Date default now()
Target Date: Date (user input)
Destination: reference data Checkpoint
Progress: Completed, Failed, In progress


*/