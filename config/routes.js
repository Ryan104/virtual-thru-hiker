const router = require('express').Router();
const controllers = require('../controllers');

/* Landing Page */
router.route('/')
	.get(controllers.statics.home);

/* App Page */
router.route('/app')
	.get(controllers.authenticatedUser, controllers.app.renderApp);

/* User Data Routes */
router.route('/user/totalmiles')
	.get(controllers.authenticatedUser, controllers.user.getFitData);

router.route('/user/goals')
	.get(controllers.authenticatedUser, controllers.user.getGoals)
	.post(controllers.authenticatedUser, controllers.user.postGoal);

router.route('/user/goals/:id')
	.put(controllers.authenticatedUser, controllers.user.updateGoal)
	.delete(controllers.authenticatedUser, controllers.user.deleteGoal);

/* Authentication Routes */
router.route('/auth/google')
	.get(controllers.auth.googleLogin);

router.route('/auth/google/callback')
	.get(controllers.auth.googleCallback);

router.route('/auth/logout')
	.get(controllers.auth.logout);


module.exports = router;
