const request = require('request');
const baseApiUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/derived%3Acom.google.step_count.delta%3Acom.google.android.gms%3Aestimated_steps/datasets/';
const keyParam = '?key=' + process.env.FIT_API_KEY;
const db = require('../models');

const testing = true; // prevents excessive api calls, change to false to get real data

// This route returns the latest user walking data by contacting the fit api
// It responds with a JSON file containing the users current total distance
const getFitData = (req, res) => {
	// setup API call
	let startTime = convertToNanoS(res.locals.currentUser.fitData.lastUpdate);
	let now = Date.now();
	let endTime = convertToNanoS(now);

	console.log('start: ' + startTime);
	console.log('endTime: ' + endTime);

	const apiURL = `${baseApiUrl}${startTime}-${endTime}${keyParam}`;
	const options = {
		url: apiURL,
		headers: {
			Authorization: 'Bearer ' + res.locals.currentUser.google.accessToken
		}
	};
	
	// make api call
	if (!testing){

	request(options, (err, response, body) => {
		if (err) return console.log(err);
		
		// Parse and total step count from JSON data
		let steps = totalSteps(JSON.parse(body).point);
		let currentUserSteps = res.locals.currentUser.fitData.totalSteps;
		let newStepTotal = currentUserSteps + steps;

		// check values in console
		console.log('previous steps: ' + currentUserSteps);
		console.log('recent steps: ' + steps);
		console.log('new stepTotal should be: ' + newStepTotal);

		// add new steps to user and change lastUpdate to now
		db.User.findOneAndUpdate(
			{"google.id": res.locals.currentUser.google.id},
			{
				fitData: {
					totalSteps: newStepTotal,
					lastUpdate: now
				}
			}, 
			{new: true},
			(err, user) => {
				if (err) return console.log(err);
				console.log(user.fitData.totalSteps);

				// data sent to user
				res.json({'totalDistance': user.getTotalDistance()});
			});
	});
	} else {
		// NOTE: SENDING FAKE DATA FOR TESTING
		res.json({'totalDistance': 225.34521});
	}
};

module.exports = { getFitData };


//****************
//HELPER FUNCTIONS
//****************

// take data from fit api call and reduce into total steps
function totalSteps(data){
	let total = 0;
	console.log('length: ' + data.length);
	//TODO: use reduce instead of foreach
	data.forEach(point => {
		total += point.value[0].intVal;
	});
	return total;
}

// convert time to nanoseconds (required by fit API)
function convertToNanoS(dateStr){
	const date = new Date(dateStr);
	const dateNano = date.getTime() * 1000000;
	return dateNano;
}
