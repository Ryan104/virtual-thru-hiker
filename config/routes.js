const router = require('express').Router();
const controllers = require('../controllers');

router.route('/')
	.get(controllers.statics.home);

router.route('/app')
	.get(authenticatedUser, controllers.app.renderApp);

router.route('/user/totalmiles')
	.get(authenticatedUser, controllers.user.getFitData);

router.route('user/goals')
	.get(authenticatedUser, (req, res) => res.json({'message': 'nothing to see here'}))
	.post(authenticatedUser, controllers.user.postGoal)
	.delete(authenticatedUser, (req, res) => res.json({'message': 'nothing to see here'}));

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