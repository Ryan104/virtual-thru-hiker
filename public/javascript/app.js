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

	// get and render all goals
	$.get('/user/goals', function (res) {
		console.log(res);
		$('#goalContainer').empty();
		res.goals.forEach(function (goal) {
			$('#goalContainer').prepend(renderGoalCard(goal));
		});
	});

	// open newgoal modal
	$('#newGoalBtn').on('click', function () {
		$('#newGoalModal').modal();
	});

	// post new goal
	$('#newGoalModal').on('click', '#saveNewGoal', function () {
		var formContent = $(this).closest('.modal').find('form').serialize();
		console.log(formContent);
		// post form content
		$.post('/user/goals?' + formContent, function (response) {
			console.log(response);
			// prepend new goal to goals list
			$('#goalContainer').prepend(renderGoalCard(response));
		});
	});

	// delete goal (delete)
	$('#goalContainer').on('click', '.delete-goal', function () {
		var $goalCard = $(this).closest('.card');
		var goalId = $goalCard.attr('data-id');
		console.log(goalId);
		$.ajax({
			method: 'DELETE',
			url: '/user/goals/' + goalId,
			success: function success(res) {
				console.log(res);
				$goalCard.remove();
			}
		});
	});

	// mark goal complete (Put call)
	$('#goalContainer').on('click', '.complete-goal', function () {
		console.log('clicked complete');
		var $goalCard = $(this).closest('.card');
		var goalId = $goalCard.attr('data-id');
		$.ajax({
			method: 'PUT',
			url: '/user/goals/' + goalId,
			data: { complete: true },
			success: function success(res) {
				console.log(res);
				$goalCard.replaceWith(renderGoalCard(res));
			}
		});
	});
});

/*
 * CLICK LISTENERS
 */

function updateProgBar() {
	var percent = (totalMiles / trailTotal * 100).toFixed(2);
	if (percent < 1) percent = 1; // minimum percent is 1 so something shows on bar

	// Update Bar
	$('#prog-total-mi').empty().append(totalMiles);
	$('#main-progbar').attr('style', 'width: ' + percent + '%; height: 50px;');
}

// this function gets all the goals
function getGoals() {
	// TODO: THIS - it doesnt work yet
	$.ajax({
		url: '/user/goals',
		success: function success(res) {
			updateGoalCards(res);
		}
	});
	//renderGoalCards();
}

// this function renders the a goal card
function renderGoalCard(goalData) {
	var date = new Date(goalData.target.date).toLocaleDateString();

	var footer = void 0;
	if (goalData.complete) {
		footer = '<div class="alert alert-success" role="alert">Complete</div>';
	} else {
		footer = '<button class="btn btn-success complete-goal">Mark Complete</button>\n\t\t\t\t\t<button class="btn btn-danger delete-goal">Delete Goal</button>';
	}

	return '\n\t\t<div class="card" data-id="' + goalData._id + '">\n\t\t\t<div class="card-body">\n\t\t\t\t<h4 class="card-title">Reach ' + goalData.target.name + ' by ' + date + '</h4>\n\t\t\t\t<p class="card-text">From ' + goalData.start.distance + ' to ' + goalData.target.distance + '</p>\n\t\t\t\t' + footer + '\n\t\t\t</div>\n\t\t</div>\n\t';
}