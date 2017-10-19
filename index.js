// NOTE: RUN WITH gulp start //

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
require('dotenv').config();


/*
 * Middleware
 */

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({secret: 'Virtual Hiker', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// Congigure hbs View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials')); // set partials location
hbs.localsAsTemplateData(app); // allow locals to be accessed from templates with @local syntax


// Serve static files in public folder
// NOTE: Run gulp to compile sass
app.use(express.static('./public'));


/*
 * Routes
 */

app.get('/', (req, res) => {
	console.log('get / route hit');
	res.render('index');
});

app.get('/app', (req, res) => {
	console.log(res.locals.currentUser);
	res.render('app', {user: res.locals.currentUser});
});

app.get('/auth/google',
	passport.authenticate('google', {
		scope:
			[
			'profile',
			'email',
			'https://www.googleapis.com/auth/fitness.activity.read'
			]
		}
	)
);

app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/app',
		failureRedirect: '/' //TODO: redirect failure to login page with flash msg
	})
);

app.listen(process.env.PORT || 3000, () => (console.log('process up and running')));
