'use strict';

/**
 * app.js
 */

/* set globals */
var totalMiles = 0;
var trailTotal = 2175;

$(document).ready(function () {
	console.log('js/jquery loaded');

	/* get and render user's goals, upcoming places, and total miles */
	/* use a promise so the user miles are updated with an api call before anything else is done */
	var updateMilesPromise = new Promise(getTotalMilage);

	updateMilesPromise.then(function () {
		getCurrentGoals();
		getUpcomingPlaces();
	});

	/* set click listeners */
	$('#hideComplete').on('click', handleHideGoals); // Hide/Show complete goals
	$('#goalContainer').on('click', '.complete-goal', handleCompleteGoal); // mark goal complete
	$('#newGoalModal').on('click', '#saveNewGoal', handleCreateGoal); // post new goal
	$('#goalContainer').on('click', '.delete-goal', handleDeleteGoal); // delete goal
	$('#newGoalBtn').on('click', function () {
		$('#newGoalModal').modal();
	}); // open newgoal modal
});

/**************
 * AJAX CALLS *
 **************/

function getTotalMilage(resolve, reject) {
	/* Get req total miles and update prog bar */
	$.ajax({
		url: '/user/totalmiles',
		success: function success(res) {
			totalMiles = res.totalDistance.toFixed(1);
			updateProgBar();
			if (resolve) resolve(); /* resolve promise */
		}
	});
}

function getUpcomingPlaces() {
	/* Gets and renders the next 3 places */
	$.get('/user/upcoming', function (res) {
		console.log(res);
		$('#placesContainer').empty(); /* remove spinner */
		res.places.forEach(function (place) {
			/* render each place */
			$('#placesContainer').append(renderPlaceCard(place));
		});
	});
}

function getCurrentGoals() {
	/* Get user's current goals render them */
	$.get('/user/goals', function (res) {
		$('#goalContainer').empty(); /* remove spinner */
		res.goals.forEach(function (goal) {
			/* render each goal */
			$('#goalContainer').prepend(renderGoalCard(goal));
		});
	});
}

function postNewGoal(formContent) {
	/*Post requst new goal from form and render the new goal */
	$.post('/user/goals?' + formContent, function (response) {
		$('#goalContainer').prepend(renderGoalCard(response));
	});
}

function updateGoalCompletion(goalId, $goalCard) {
	/* Send put req to update goal and re-render it */
	$.ajax({
		method: 'PUT',
		url: '/user/goals/' + goalId,
		data: { complete: true },
		success: function success(res) {
			$goalCard.replaceWith(renderGoalCard(res));
		}
	});
}

function deleteGoal(goalId, $goalCard) {
	/* Send delete req and remove goal from page */
	$.ajax({
		method: 'DELETE',
		url: '/user/goals/' + goalId,
		success: function success(res) {
			console.log(res);
			$goalCard.remove();
		}
	});
}

/******************
 * CLICK HANDLERS *
 ******************/

function handleHideGoals() {
	var btn = $(this);
	var currentState = btn.attr('data-state');
	var completedCards = $('#goalContainer .alert-success').closest('.card');

	if (currentState === 'visible') {
		/* hide */
		btn.attr('data-state', 'hidden');
		btn.text('SHOW COMPLETED');
		completedCards.fadeOut();
	} else {
		/* show */
		btn.attr('data-state', 'visible');
		btn.text('HIDE COMPLETED');
		completedCards.show();
	}
}

function handleCreateGoal() {
	var formContent = $(this).closest('.modal').find('form').serialize();
	postNewGoal(formContent);
}

function handleCompleteGoal() {
	var $goalCard = $(this).closest('.card');
	var goalId = $goalCard.attr('data-id');
	updateGoalCompletion(goalId, $goalCard);
}

function handleDeleteGoal() {
	var $goalCard = $(this).closest('.card');
	var goalId = $goalCard.attr('data-id');
	deleteGoal(goalId, $goalCard);
}

/******************
 * RENDER METHODS *
 ******************/

function renderGoalCard(goalData) {
	/* return html string for one goal card given json response data */
	var date = new Date(goalData.target.date).toLocaleDateString();
	var footer = void 0;

	if (goalData.complete) {
		/* Conditionally render footer based on completion status */
		footer = '<div class="alert alert-success" role="alert">Complete</div>';
	} else {
		footer = '<button class="btn btn-success complete-goal">Mark Complete</button>\n\t\t\t\t\t<button class="btn btn-danger delete-goal">Delete Goal</button>';
	}

	return '\n\t\t<div class="card" data-id="' + goalData._id + '">\n\t\t\t<div class="card-body">\n\t\t\t\t<h4 class="card-title">Reach ' + goalData.target.name + ' by ' + date + '</h4>\n\t\t\t\t<p class="card-text">From ' + Math.round(goalData.start.distance) + ' to ' + Math.round(goalData.target.distance) + '</p>\n\t\t\t\t' + footer + '\n\t\t\t</div>\n\t\t</div>\n\t';
}

function renderPlaceCard(place) {
	return '\n\t\t<div class="card">\n\t\t\t<div class="card-body">\n\t\t\t\t<div class="row">\n\t\t\t\t\t<div class="col-9">\n\t\t\t\t\t\t<h5 class="card-title">' + place.name + '</h5>\n\t\t\t\t\t\t<p class="card-text">' + place.distance + ' mi away</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="col-3">\n\t\t\t\t\t\t<img class="img-fluid" src="' + place.typeImgUrl + '">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t';
}

function updateProgBar() {
	/* Calculate percent completion */
	var percent = (totalMiles / trailTotal * 100).toFixed(2);
	if (percent < 1) percent = 1; // minimum percent is 1 so something shows on bar

	/* Update Bar */
	$('#prog-total-mi').empty().append(totalMiles);
	$('#main-progbar').attr('style', 'width: ' + percent + '%; height: 50px;');
}