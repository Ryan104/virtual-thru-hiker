const router = require('express').Router();
const controllers = require('../controllers');

router.route('/')
	.get(controllers.statics.home);

router.route('/app')
	.get((req, res) => {
		console.log(res.locals.currentUser);
		res.render('app', {user: res.locals.currentUser});
	});

router.route('/auth/google')
	.get(controllers.auth.googleLogin);

router.route('/auth/google/callback')
	.get(controllers.auth.googleCallback);

module.exports = router;
