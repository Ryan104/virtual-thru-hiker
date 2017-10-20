let totalMiles = 0;
const trailTotal = 2174.6;

$(document).ready(() => {
	console.log('js/jquery loaded');


	// get user total miles
	$.ajax({
		url: '/user/totalmiles',
		success: (res) => {
			console.log(res);
			totalMiles = res.totalDistance;
			let percentComplete = (totalMiles/trailTotal).toFixed(2);
			if (percentComplete < 1){
				percentComplete = 1;
			}
			console.log('% complete: ' + percentComplete);

		}
	});

	// get user goals

	// get upcomming trailmarks

});