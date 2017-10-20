const db = require('../models');

db.User.remove({}, err => {
	if (err) console.log(err);

	db.User.create(
	{
	    "fitData" : {
	        "lastUpdate" : new Date("2017-10-19T21:22:56.485Z"),
	        "totalSteps" : 0
	    },
	    "google" : {
	        "id" : 103964027083415003556,
	        "accessToken" : "ya29.GmLqBHUjBx-tL8nMRMt4zI2dJOGQiM_e8DZGfdmqmGAS1kgezPRGxRZeQigynjJitfib-QBNNxp7eA-9cl8Lbi7h6UEMmmEtSrWK2zHNTayNwn7fkHyVcEjaE0JbvovhWeBnVw"
	    },
	    "profile" : {
	        "name" : "Ryan",
	        "email" : "ryan.d.elliott@gmail.com",
	        "image" : "https://lh4.googleusercontent.com/-MbWe9Kuwfp0/AAAAAAAAAAI/AAAAAAAAJbg/YJ14gJRtI18/photo.jpg?sz=50",
	        "startDate" : new Date("2017-10-19T21:22:56.485Z")
	    }
	}, (err, user) => {
		console.log('user created');
	    });
});
