'use strict';

var totalMiles = 0;
var trailTotal = 2175;

$(document).ready(function () {
	console.log('js/jquery loaded');

	// get user total miles
	$.ajax({
		url: '/user/totalmiles',
		success: function success(res) {
			totalMiles = res.totalDistance.toFixed(1);
			updateProgBar();
		}
	});

	// get upcomming trailmarks
});

function updateProgBar() {
	var percent = (totalMiles / trailTotal * 100).toFixed(2);
	if (percent < 1) percent = 1; // minimum percent is 1 so something shows on bar

	// Update Bar
	$('#prog-total-mi').empty().append(totalMiles);
	$('#main-progbar').attr('style', 'width: ' + percent + '%; height: 50px;');
}

// this function gets all the goals
function getGoals() {
	$.ajax({
		url: '/user/goals',
		success: function success(res) {
			updateGoalCards(res);
		}
	});
	renderGoalCards();
}

// this function renders the goal cards 
function renderGoalCards(goalArr) {
	// clear $('#goalContailer')
	// for each goal in goals array, create a new goal card and append to goal container
}