const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
	start: {
		date: { type: Date, default: Date.now },
		distance: Number
	},
	target: {
		name: String,
		date: Date,
		distance: Number
	},
	complete: Boolean
});

const UserSchema = new Schema({
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
		lastUpdate: { type: Date, default: Date.now}, // time of last update from fit API
		totalSteps: { type: Number, default: 0 },
		stepsPerMile: { type: Number, default: 2186 }
	},
	goals: [GoalSchema]
});

UserSchema.methods.getTotalDistance = function(){
	console.log('steps/mi: ' + this.fitData.stepsPerMile);
	console.log('calc miles: ' + this.fitData.totalSteps / this.fitData.stepsPerMile);
	return this.fitData.totalSteps / this.fitData.stepsPerMile;
};

module.exports = mongoose.model('User', UserSchema);