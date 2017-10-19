const request = require('request');

const getFitData = (req, res) => {
	const apiURL = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/derived%3Acom.google.step_count.delta%3Acom.google.android.gms%3Aestimated_steps/datasets/1507096800000000000-1507186365767000000?key=AIzaSyBuk-lBklIXJa-RMbLUgv73c5IbBbgvWD8'
	
	const options = {
		url: apiURL,
		headers: {
			Authorization: 'Bearer ' + res.locals.currentUser.google.accessToken
		}
	};
	
	request(options, (err, response, body) => {
		if (err) console.log(err);
		// Steps data
		let data = JSON.parse(body).point;
		console.log(data.length);
		let steps = totalSteps(data);
		res.json({'steps': steps});
	});
};

function totalSteps(data){
	let total = 0;
	console.log('length: ' + data.length);
	//console.log(data[0].value[0].intVal);
	data.forEach(point => {
		total += point.value[0].intVal;
	});
	return total;
}

module.exports = { getFitData };
