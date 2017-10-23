module.exports.auth = require('./auth');
module.exports.statics = require('./statics');
module.exports.user = require('./user');
module.exports.app = require('./app');

/* check if user is authenticated using passport */
module.exports.authenticatedUser = (req, res, next) => {
	// check user authentication status
	if(req.isAuthenticated()) return next();
	res.redirect('/');
};