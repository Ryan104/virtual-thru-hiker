let totalMiles = 0;
const trailTotal = 2175;

$(document).ready(() => {
	console.log('js/jquery loaded');


	// get user total miles
	$.ajax({
		url: '/user/totalmiles',
		success: (res) => {
			totalMiles = res.totalDistance.toFixed(1);
			updateProgBar();
		}
	});

	// get user goals

	// get upcomming trailmarks

});

function updateProgBar(){
	let percent = (totalMiles/trailTotal * 100).toFixed(2);
	if (percent < 1) percent = 1; // minimum percent is 1 so something shows on bar

	// Update Bar
	$('#prog-total-mi').empty().append(totalMiles);
	$('#main-progbar').attr('style', 'width: '+ percent+'%; height: 50px;');
}