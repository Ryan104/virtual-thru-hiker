const db = require('../models');

const renderApp = (req, res) => {
	let currentUser = res.locals.currentUser;
	// process goal data
	let goals = processGoals(currentUser.goals);
	// TODO: sort by date or completion, maybe have completed in separate array to be hidden/expanable
	
	// give page all the trailpoints greater than current location to be selectable in new goal form
	db.Trailmark.find({"toStart": {$gt: (currentUser.fitData.totalSteps / currentUser.fitData.stepsPerMile)}}, (err, trailMarks) => {
		if (err) {
			console.log(err);
			res.send(err);
		}
		// process all marks into just name, toStart, fromCurrent
		let trailList = trailMarks.map((mark) => {
			return {
				name: mark.name,
				mileMark: mark.toStart
			};
		});
		res.render('app', {user: res.locals.currentUser, goalCards: goals, trailList: trailList});
	});
};

module.exports = { renderApp };


// HELPER FUNCTIONS //

// process goals data
function processGoals(userGoalsArr){
	return userGoalsArr.map(goal => {
		let targetDate = new Date(goal.target.date);
		return {
			goalId: goal._id,
			titleText: `Reach ${goal.target.name} by ${targetDate.toLocaleDateString()}`,
			bodyText: `From ${goal.start.distance} to ${goal.target.distance}`,
			complete: goal.complete
		};
	});
}