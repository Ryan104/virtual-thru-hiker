const db = require('../models');
// TODO: sort by date or completion, maybe have completed in separate array to be hidden/expanable

const renderApp = (req, res) => {
	const currentUser = res.locals.currentUser;
	const currentMilage = currentUser.fitData.totalSteps / currentUser.fitData.stepsPerMile;
	
	/* give page all the trailpoints greater than current location to be selectable in new goal form */
	db.Trailmark.find({"toStart": {$gt: currentMilage}}, (err, trailMarks) => {
		if (err) {
			console.log(err);
			res.send(err);
		}

		/* Render the app page with hbs */
		const templateData = {
			user: res.locals.currentUser,
			trailList: trailMarks.map(mapTrailMarks)
		};
		res.render('app', templateData);
	});
};

module.exports = { renderApp };


// HELPER FUNCTIONS //

/* process trailmarks for form generation in hbs */
function mapTrailMarks(mark){
	return {
		name: mark.name,
		mileMark: mark.toStart
	};
}