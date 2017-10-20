const router = require('express').Router();
const controllers = require('../controllers');

router.route('/')
	.get(controllers.statics.home);

router.route('/app')
	.get(authenticatedUser, (req, res) => {
		// process goal data
		let goals = res.locals.currentUser.goals.map((goal) => {
			let targetDate = new Date(goal.target.date);
			return {
				goalId: goal._id,
				titleText: `Reach ${goal.target.name} by ${targetDate.toLocaleDateString()}`,
				bodyText: `From ${goal.start.distance} to ${goal.target.distance}`,
				complete: goal.complete
			};
		});
		// TODO: sort by date or completion, maybe have completed in separate array to be hidden/expanable
		res.render('app', {user: res.locals.currentUser, goalCards: goals});
	});

router.route('/user/totalmiles')
	.get(authenticatedUser, controllers.user.getFitData);

router.route('/auth/google')
	.get(controllers.auth.googleLogin);

router.route('/auth/google/callback')
	.get(controllers.auth.googleCallback);

router.route('/auth/logout')
	.get(controllers.auth.logout);

module.exports = router;


function authenticatedUser(req, res, next){
	// check user authentication status
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}