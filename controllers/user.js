const request = require('request');
const db = require('../models');

const baseApiUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/derived%3Acom.google.step_count.delta%3Acom.google.android.gms%3Aestimated_steps/datasets/';
const keyParam = '?key=' + process.env.FIT_API_KEY;

const testing = false; // set to false to get real data, true to use fake api call

/**************
 * GOOGLE FIT *
 **************/

const getFitData = (req, res) => {
	/**
	 *This route returns the latest user walking data by contacting the fit api
	 * It responds with a JSON file containing the users current total distance
	 */

	/* setup API call parameters */
	const startTime = convertToNanoS(res.locals.currentUser.fitData.lastUpdate);
	const now = Date.now();
	const endTime = convertToNanoS(now);
	const apiURL = `${baseApiUrl}${startTime}-${endTime}${keyParam}`;
	const options = {
		url: apiURL,
		headers: {
			Authorization: 'Bearer ' + res.locals.currentUser.google.accessToken
		}
	};
	
	/* make api call */
	if (!testing){
	request(options, (err, response, body) => {
		if (err) return console.log(err);
		
		/* Parse and total step count from JSON response data */
		const steps = totalSteps(JSON.parse(body).point);
		const currentUserSteps = res.locals.currentUser.fitData.totalSteps;
		const newStepTotal = currentUserSteps + steps;

		/* add new steps to user and change lastUpdate to now */
		db.User.findOneAndUpdate({"google.id": res.locals.currentUser.google.id},
			{ /* data to update */
				fitData: {
					totalSteps: newStepTotal,
					lastUpdate: now
				}
			},
			/* respond with updated user milage */
			{new: true},
			(err, user) => {
				if (err) return console.log(err);
				res.json({'totalDistance': user.getTotalDistance()});
			});
	});
	} else {
		// NOTE: SENDING FAKE DATA FOR TESTING
		res.json({'totalDistance': 225.34521});
	}
};


/****************
 * TRAIL POINTS *
 ****************/

const getPlaces = (req, res) => {
	/* return the next 3 trailmarks from user location */
	/* each should have Name, Distance from user, Img URL */
	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		if (err) return console.log(err);
		
		/* Find next 3 upcoming points */
		const currentDistance = user.getTotalDistance();
		db.Trailmark.find({ toStart: {$gt: currentDistance}}, {'name': 1, 'toStart': 1, 'type': 1}, {limit: 3}, (err, points) => {
			if (err) return console.log(err);
			
			resPoints = processPointsForCards(points, currentDistance);
			currentPoint = {name: 'Springer Mountain'};

			res.json({upcoming: resPoints, current: currentPoint});
		});
	});
};

/*********
 * GOALS *
 *********/

const getGoals = (req, res) => {
	/* return all the users goals */
	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		if (err) return console.log(err);
		res.json({goals: user.goals});
	});
};

const postGoal = (req,res) => {
	/** 
	 *Post a new goal with the form data given in the query string
	 *The query should contain the name (destination and distance from start)
	 *  and the target completion date.
	 *Respond with the newly created goal
	 */

	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		if (err) return console.log(err);
		/* create goal according to schema */
		const newGoal = {
			start: {
				distance: user.getTotalDistance()
			},
			target: {
				name: req.query.name.split(' - ')[0], // parse target name from query.name
				date: new Date(req.query.date),
				distance: parseFloat(req.query.name.split(' - ')[1]) // parse distance from query.name
			},
			complete: false
		};
		/* add goal to user, save, respond with the goal */
		user.goals.push(newGoal);
		user.save(err => { res.json(user.goals[user.goals.length - 1]); });
	});
};

const updateGoal = (req, res) => {
	/**
	 *Find goal by req param id and update its completion status with the req JSON data
	 *Respond with the updated goal
	 */
	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		if (err) return console.log(err);

		const goalIndex = user.goals.findIndex(goal => (goal._id == req.params.id));

		user.goals[goalIndex].complete = req.body.complete;
		user.save(err => {
			if (err) throw err;
			res.json(user.goals[goalIndex]);
		});
	});
};

const deleteGoal = (req, res) => {
	/**
	 *Find the goal by the ID given the req params and remove it from the current user
	 *Respond with a confirmation message
	 */
	db.User.findOne({"google.id": res.locals.currentUser.google.id}, (err, user) => {
		if (err) return console.log(err);

		const goalIndex = user.goals.findIndex(goal => (goal._id == req.params.id));

		user.goals.splice(goalIndex, 1);
		user.save(err => {
			if (err) throw err;
			res.json({message: 'goal deleted'});
		});
	});
};


module.exports = { getFitData, postGoal, deleteGoal, getGoals, updateGoal, getPlaces };


/********************
 * HELPER FUNCTIONS *
 ********************/

function totalSteps(data){
	/* take data from fit api call and reduce into total steps */
	return data.reduce((sum, point) => sum + point.value[0].intVal, 0);
}

function convertToNanoS(dateStr){
	/* convert time to nanoseconds (required by fit API) */
	return (new Date(dateStr)).getTime() * 1000000;
}

function processPointsForCards(points, currentDistance){
	/* Take trailmarks from db and convert to format required by frontend */
	return points.map((point) => {
		let typeImgUrl;
		switch(point.type) {
			case 'TOWN':
				typeImgUrl = 'images/town_icon.png';
				break;
			case 'SHELTER':
				typeImgUrl = 'images/tent_icon.png';
				break;
			case 'FEATURE':
				typeImgUrl = 'images/mtn_icon.png';
				break;
			default:
				console.log('default switch type');
		}

		return {
			name: point.name,
			typeImgUrl: typeImgUrl,
			distance: (point.toStart - currentDistance).toFixed(1)
		};
	});
}
