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
		console.log('clicked delete');
		let goalId = $(this).closest('.card').attr('data-id');
		console.log(goalId);
		$.ajax({
			method: 'DELETE',
			url: '/user/goals/' + goalId,
			success: function(res){
				console.log(res);
			}
		});
	});

	// mark goal complete (Put call)

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