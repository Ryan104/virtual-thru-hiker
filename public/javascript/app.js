'use strict';

$(document).ready(function () {
	console.log('js/jquery loaded');

	// get user data
	$.ajax({
		url: '/user',
		success: function success(res) {
			return console.log(res);
		}
	});
});