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
	if (!testing){ // collect data from fit api

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

//***********
//GOAL CONTROLLERS
//*************

const getGoals = (req, res) => {
	// return all the goals
	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		if (err) return console.log(err);
		res.json({goals: user.goals});
	});
};

const postGoal = (req,res) => {
	// req should contain json with goal name, target date, target miles
	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		if (err) return console.log(err);
		// process the query string (get name and milage from str format 'name - nn.n mi')
		let targetName = req.query.name.split(' - ')[0];
		let targetDistance = parseFloat(req.query.name.split(' - ')[1]);
		// create a new goal
		let newGoal = {
			start: {
				distance: user.getTotalDistance()
			},
			target: {
				name: targetName,
				date: new Date(req.query.date),
				distance: targetDistance
			},
			complete: false
		};
		// add goal to user document
		user.goals.push(newGoal);
		user.save(function(err){
			newGoal = user.goals[user.goals.length -1];
			console.log(newGoal);
			res.json(newGoal);
		});
		// save new goal to db and return new goal response
	});
};

const updateGoal = (req, res) => {
	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		// find the requested goal
		console.log('update');
		let goalIndex = user.goals.findIndex((goal) => {
			return goal._id == req.params.id;
		});
		console.log(user.goals[goalIndex]);
		console.log(req.body);
		user.goals[goalIndex].complete = req.body.complete;
		user.save(err => {
			if (err) {
				console.log(err);
				res.json(err);
			}
			res.json(user.goals[goalIndex]);

		});
	});
};

const deleteGoal = (req, res) => {
	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		if (err) return console.log(err);
		console.log(req.params.id);
		let goalIndex = user.goals.findIndex((goal) => {
			return goal._id == req.params.id;
		});
		console.log(goalIndex);
		user.goals.splice(goalIndex, 1);
		user.save(err => {
			if (err) throw err;
			res.json({message: 'goal deleted'});
		});
	});
};



module.exports = { getFitData, postGoal, deleteGoal, getGoals, updateGoal };


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
