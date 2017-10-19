const router = require('express').Router();
const controllers = require('../controllers');

router.route('/')
	.get(controllers.statics.home);

router.route('/app')
	.get(authenticatedUser, (req, res) => {
		res.render('app', {user: res.locals.currentUser});
	});

router.route('/user')
	.get(authenticatedUser, controllers.user.getFitData);

router.route('/auth/google')
	.get(controllers.auth.googleLogin);

router.route('/auth/google/callback')
	.get(controllers.auth.googleCallback);

module.exports = router;


function authenticatedUser(req, res, next){
	// check user authentication status
	if(req.isAuthenticated()) return next();
	res.redirect('/');
}