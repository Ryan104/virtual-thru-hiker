const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('hbs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Congigure hbs View Engine
app.set('views', path.join(__dirname, 'views'));
//app.engine('hbs', )
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials')); // set partials location
hbs.localsAsTemplateData(app); // allow locals to be accessed from templates with @local syntax


// Serve static files in public folder
// NOTE: Run gulp to compile sass
app.use(express.static('public'));


app.get('/', (req, res) => {
	res.render('index', {name: 'Ryan'});
});



app.listen(process.env.PORT || 3000, () => (console.log('process up and running')));