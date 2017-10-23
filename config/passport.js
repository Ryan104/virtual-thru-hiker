/** passport.js ** 
 *	middleware for suppling the authentication module 
 *	with the google Oauth2 strategy.
 */

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const db = require('../models');

module.exports = function(passport){
	passport.serializeUser(function(user, done) {	// session management
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {	// session management
	  done(null, obj);
	});
	
	passport.use(new GoogleStrategy({				// setup google strategy
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.BASE_URL + '/auth/google/callback',
		passReqToCallback: true
	}, callback));
};


function callback(request, accessToken, refreshToken, profile, done){
/**
 * callback function to be called when the google auth request returns
 *  profile.id - identifies the user. use to validate with app DB
 *  accessToken - used in head of API requests to validate user. Expires every hr.
 *  refreshToken - used to get a new accessToken after it expires. Store somewhere secure.
 *  done - callback to be called when done
 */
	db.User.findOne({ 'google.id': profile.id }, (err, user) => {
		if (err) return done(err);

		/* Login user that already exists */
		if (user){
			console.log('logging in user: ' + profile.id);
			user.google.accessToken = accessToken;
			user.save(err => {
				if (err) return console.log(err);
				console.log('user logged in!');
				return done(err, user);
			});
			
		/* Create new user */
		} else { 
			console.log('creating new user: ' + profile.id);
			db.User.create({
				profile: {
					name: profile.name.givenName,
					email: profile.email,
					image: profile.photos[0].value,
				},
				google: {
					id: profile.id,
					accessToken: accessToken
				}
			}, (err, user) => {
				if (err) return console.log(err);
				console.log('new user created!');
				return done(null, user);
			});
		}
	});
}