const renderApp = (req, res) => {
	// process goal data
	let goals = processGoals(res.locals.currentUser.goals);
	// TODO: sort by date or completion, maybe have completed in separate array to be hidden/expanable
	res.render('app', {user: res.locals.currentUser, goalCards: goals});
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