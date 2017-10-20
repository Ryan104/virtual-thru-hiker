'use strict';

var totalMiles = 0;
var trailTotal = 2174.6;

$(document).ready(function () {
	console.log('js/jquery loaded');

	// get user total miles
	$.ajax({
		url: '/user/totalmiles',
		success: function success(res) {
			console.log(res);
			totalMiles = res.totalDistance;
			var percentComplete = (totalMiles / trailTotal).toFixed(2);
			if (percentComplete < 1) {
				percentComplete = 1;
			}
			console.log('% complete: ' + percentComplete);
		}
	});

	// get user goals

	// get upcomming trailmarks
});