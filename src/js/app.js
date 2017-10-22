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

	// get upcomming trailmarks

	// get and render all goals
	
	$.get('/user/goals', res => {
		console.log(res);
		$('#goalContainer').empty();
		res.goals.forEach((goal) => {
			$('#goalContainer').prepend(renderGoalCard(goal));
		});
	});

	$('#hideComplete').on('click', function(){
		let btn = $(this);
		let currentState =  btn.attr('data-state');
		console.log(currentState);
		let completedCards = $('#goalContainer .alert-success').closest('.card');
		console.log(completedCards);
		if (currentState === 'visible'){
			// hide
			btn.attr('data-state', 'hidden');
			btn.text('SHOW COMPLETED');
			completedCards.fadeOut();
		} else {
			// show
			btn.attr('data-state', 'visible');
			btn.text('HIDE COMPLETED');
			completedCards.show();
		}
	});


	// open newgoal modal
	$('#newGoalBtn').on('click', function(){
		$('#newGoalModal').modal();
	});

	// post new goal
	$('#newGoalModal').on('click', '#saveNewGoal', function(){
		let formContent = $(this).closest('.modal').find('form').serialize();
		console.log(formContent);
		// post form content
		$.post('/user/goals?' + formContent, function(response){
			console.log(response);
			// prepend new goal to goals list
			$('#goalContainer').prepend(renderGoalCard(response));
		});
	});

	// delete goal (delete)
	$('#goalContainer').on('click', '.delete-goal', function(){
		let $goalCard = $(this).closest('.card');
		let goalId = $goalCard.attr('data-id');
		console.log(goalId);
		$.ajax({
			method: 'DELETE',
			url: '/user/goals/' + goalId,
			success: function(res){
				console.log(res);
				$goalCard.remove();
			}
		});
	});

	// mark goal complete (Put call)
	$('#goalContainer').on('click', '.complete-goal', function(){
		console.log('clicked complete');
		let $goalCard = $(this).closest('.card');
		let goalId = $goalCard.attr('data-id');
		$.ajax({
			method: 'PUT',
			url: '/user/goals/' + goalId,
			data: {complete: true},
			success: function(res){
				console.log(res);
				$goalCard.replaceWith(renderGoalCard(res));
			}
		});
	});

});

/*
 * CLICK LISTENERS
 */

function updateProgBar(){
	let percent = (totalMiles/trailTotal * 100).toFixed(2);
	if (percent < 1) percent = 1; // minimum percent is 1 so something shows on bar

	// Update Bar
	$('#prog-total-mi').empty().append(totalMiles);
	$('#main-progbar').attr('style', 'width: '+ percent+'%; height: 50px;');
}

// this function gets all the goals
function getGoals(){ // TODO: THIS - it doesnt work yet
	$.ajax({
		url: '/user/goals',
		success: (res) => {
			updateGoalCards(res);
		}
	});
	//renderGoalCards();
}

// this function renders the a goal card
function renderGoalCard(goalData){
	let date = (new Date(goalData.target.date)).toLocaleDateString();

	let footer;
	if (goalData.complete){
		footer = `<div class="alert alert-success" role="alert">Complete</div>`;
	} else {
		footer = `<button class="btn btn-success complete-goal">Mark Complete</button>
					<button class="btn btn-danger delete-goal">Delete Goal</button>`;
	}

	return `
		<div class="card" data-id="${goalData._id}">
			<div class="card-body">
				<h4 class="card-title">Reach ${goalData.target.name} by ${date}</h4>
				<p class="card-text">From ${goalData.start.distance} to ${goalData.target.distance}</p>
				${footer}
			</div>
		</div>
	`;
}