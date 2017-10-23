const passport = require('passport');

const googleLogin = (req, res, next) => {
	let loginStrategy = passport.authenticate('google', {
		scope:
			[
			'profile',
			'email',
			'https://www.googleapis.com/auth/fitness.activity.read'
			]
		}
	);
	return loginStrategy(req, res, next);
};

const googleCallback = (req, res, next) => {
	let authCallbackStrategy = passport.authenticate('google', {
		successRedirect: '/app',
		failureRedirect: '/' //TODO: redirect failure to login page with flash msg
	});

	return authCallbackStrategy(req,res,next);
};

const logout = (req, res, next) => {
	req.logout();
	res.redirect('/');
	//TODO: flash message - logged out
};

module.exports = { googleLogin, googleCallback, logout };
