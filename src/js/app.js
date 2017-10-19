
$(document).ready(() => {
	console.log('js/jquery loaded');

	// get user data
	$.ajax({
		url: '/user',
		success: (res) => console.log(res)
	});
});