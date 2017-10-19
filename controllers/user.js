const request = require('request');
const baseApiUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/derived%3Acom.google.step_count.delta%3Acom.google.android.gms%3Aestimated_steps/datasets/';
const keyParam = '?key=' + process.env.FIT_API_KEY;

const getFitData = (req, res) => {
	// call google fit api and get steps since last login
	let startTime = convertToNanoS(res.locals.currentUser.fitData.lastUpdate);
	let endTime = convertToNanoS(Date.now());
	console.log('start: ' + startTime);
	console.log('endTime: ' + endTime);
	const apiURL = `${baseApiUrl}${startTime}-${endTime}${keyParam}`;
	
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

function convertToNanoS(dateStr){
	const date = new Date(dateStr);
	const dateNano = date.getTime() * 1000000;
	return dateNano;
}

module.exports = { getFitData };
