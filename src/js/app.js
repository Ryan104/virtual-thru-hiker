
$(document).ready(() => {
	console.log('js/jquery loaded');

	// get user total miles
	$.ajax({
		url: '/user/totalMiles',
		success: (res) => console.log(res)
	});

	// get user goals

	// get upcomming trailmarks
	
});