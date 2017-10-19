const GoogleStrategy = require('passport-google-oauth2').Strategy;
const db= require('../models');

module.exports = function(passport){
	// session management
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	// setup google strategy
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.BASE_URL + '/auth/google/callback',
		passReqToCallback: true
	}, callback));
};

// this function is to be called when the google auth request returns
function callback(request, accessToken, refreshToken, profile, done){
	// profile.id - identifies the user. use to validate with app DB
	// accessToken - used in head of API requests to validate user. Expires.
	// refreshToken - used to get a new accessToken after it expires. Store somewhere secure.
	// done - callback to be called when done

	// Look for user in db
	//	- Log user in if already exists
	//	- Create new user if not already in db
	db.User.findOne({ googleId: profile.id }, (err, user) => {
		if (err) return done(err);

		if (user){
			// returning user
			console.log('logging in user: ' + profile.id);
			user.local.accessToken = accessToken; //save new access token
			user.save(err => {
				if (err) return console.log(err);
				console.log('user logged in!');
				return done(err, user);
			});
		} else {
			// new user
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