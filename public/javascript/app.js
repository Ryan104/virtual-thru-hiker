'use strict';

$(document).ready(function () {
	console.log('js/jquery loaded');

	// get user total miles
	$.ajax({
		url: '/user/totalMiles',
		success: function success(res) {
			return console.log(res);
		}
	});

	// get user goals

	// get upcomming trailmarks
});