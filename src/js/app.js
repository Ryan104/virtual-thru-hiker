/**
 * app.js
 */

/* set globals */
let totalMiles = 0;
const trailTotal = 2175;


$(document).ready(() => {
	console.log('js/jquery loaded');

	/* get and render user's goals, upcoming places, and total miles */
	/* use a promise so the user miles are updated with an api call before anything else is done */
	let updateMilesPromise = new Promise(getTotalMilage);
	updateMilesPromise.then(() => {
		getCurrentGoals();
		getPlaces();
	});
	
	/* set click listeners */
	$('#hideComplete').on('click', handleHideGoals);  // Hide/Show complete goals
	$('#goalContainer').on('click', '.complete-goal', handleCompleteGoal);  // mark goal complete
	$('#newGoalModal').on('click', '#saveNewGoal', handleCreateGoal);  // post new goal
	$('#goalContainer').on('click', '.delete-goal', handleDeleteGoal);  // delete goal
	$('#newGoalBtn').on('click', () => { $('#newGoalModal').modal(); });  // open newgoal modal

});


/**************
 * AJAX CALLS *
 **************/

function getTotalMilage(resolve, reject){
	/* Get req total miles and update prog bar */
	$.ajax({
		url: '/user/totalmiles',
 		success: (res) => {
 			totalMiles = res.totalDistance.toFixed(1);
 			updateProgBar();
 			if (resolve) resolve(); /* resolve promise */
 		}
 	});
}

function getPlaces(){
	/* Gets and renders the next 3 places */
	$.get('/user/places', (res) => {
		console.log(res);
		$('#placesContainer').empty();	/* remove spinner */
		res.upcoming.forEach((place) => {	/* render each place */
			$('#placesContainer').append(renderPlaceCard(place));
		});
	});
}

function getCurrentGoals(){
	/* Get user's current goals render them */
	$.get('/user/goals', res => {
	 	$('#goalContainer').empty(); 	/* remove spinner */
	 	res.goals.forEach((goal) => {	/* render each goal */
	 		$('#goalContainer').prepend(renderGoalCard(goal));
	 	});
	});
}

function postNewGoal(formContent){
	 /*Post requst new goal from form and render the new goal */
	$.post('/user/goals?' + formContent, function(response){
		$('#goalContainer').prepend(renderGoalCard(response));
	});
}

function updateGoalCompletion(goalId, $goalCard){
	/* Send put req to update goal and re-render it */
	$.ajax({
		method: 'PUT',
		url: '/user/goals/' + goalId,
		data: {complete: true},
		success: function(res){
			$goalCard.replaceWith(renderGoalCard(res));
		}
	});
}

function deleteGoal(goalId, $goalCard){
	/* Send delete req and remove goal from page */
	$.ajax({
		method: 'DELETE',
		url: '/user/goals/' + goalId,
		success: function(res){
			console.log(res);
			$goalCard.remove();
		}
	});
}


/******************
 * CLICK HANDLERS *
 ******************/

function handleHideGoals(){
	let btn = $(this);
	let currentState =  btn.attr('data-state');
	let completedCards = $('#goalContainer .alert-success').closest('.card');
	
	if (currentState === 'visible'){ /* hide */
		btn.attr('data-state', 'hidden');
		btn.text('SHOW COMPLETED');
		completedCards.fadeOut();
	} else { /* show */
		btn.attr('data-state', 'visible');
		btn.text('HIDE COMPLETED');
		completedCards.show();
	}
}

function handleCreateGoal(){
	let formContent = $(this).closest('.modal').find('form').serialize();
	postNewGoal(formContent);
}

function handleCompleteGoal(){
	let $goalCard = $(this).closest('.card');
	let goalId = $goalCard.attr('data-id');
	updateGoalCompletion(goalId, $goalCard);
}

function handleDeleteGoal(){
	let $goalCard = $(this).closest('.card');
	let goalId = $goalCard.attr('data-id');
	deleteGoal(goalId, $goalCard);
}


/******************
 * RENDER METHODS *
 ******************/

function renderGoalCard(goalData){
	/* return html string for one goal card given json response data */
	const date = (new Date(goalData.target.date)).toLocaleDateString();
	let footer;

	if (goalData.complete){ /* Conditionally render footer based on completion status */
		footer = `<div class="alert alert-success" role="alert">Complete</div>`;
	} else {
		footer = `<button class="btn btn-success complete-goal">Mark Complete</button>
					<button class="btn btn-danger delete-goal">Delete Goal</button>`;
	}

	return `
		<div class="card" data-id="${goalData._id}">
			<div class="card-body">
				<h4 class="card-title">Reach ${goalData.target.name} by ${date}</h4>
				<p class="card-text">From ${Math.round(goalData.start.distance)} to ${Math.round(goalData.target.distance)}</p>
				${footer}
			</div>
		</div>
	`;
}

function renderPlaceCard(place){
	return `
		<div class="card">
			<div class="card-body">
				<div class="row">
					<div class="col-9">
						<h5 class="card-title">${place.name}</h5>
						<p class="card-text">${place.distance} mi away</p>
					</div>
					<div class="col-3">
						<img class="img-fluid" src="${place.typeImgUrl}">
					</div>
				</div>
			</div>
		</div>
	`;
}

function updateProgBar(){
	/* Calculate percent completion */
	let percent = (totalMiles/trailTotal * 100).toFixed(2);
	if (percent < 1) percent = 1; // minimum percent is 1 so something shows on bar

	/* Update Bar */
	$('#prog-total-mi').empty().append(totalMiles);
	$('#main-progbar').attr('style', 'width: '+ percent+'%; height: 50px;');
}