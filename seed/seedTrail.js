// Seed the db with trail marks //
// This must be done before using the app //

const db = require('../models');

const trailmarkData = require('./trailmarkSeedData');
console.log(trailmarkData.length);

// Empty DB
console.log('seedTrail: clearing existing collection');
db.Trailmark.remove({}, err => {
	if (err) return console.log(err);
	// Seed DB with trailmarks
	console.log('seedTrail: adding trailmarks...');
	// loop through data and process into correct SCHEMA format
	trailmarkData.forEach(data => {
		newMark = new db.Trailmark();
		newMark.name = data.name.replace(/(\(\d* ft\))|\d{5}/g, ""); //remove zip and elev from names
		newMark.type = data.type;
		newMark.location = {
			lat: data.lat,
			lon: data.lon
		};
		newMark.toStart = data["to spgr"];
		newMark.toEnd = data["to ktd"];
		newMark.elevation = data.elev;
		newMark.save();
	});
	console.log('Seeded! Please run tests');
});

