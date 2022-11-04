const { func } = require('@hapi/joi');
const controller = require('../controllers/user/index');
const auth = require('../utils/authorization');

module.exports = (router) => {

	router.route('/register')
		.post(controller.register);
	
	router.route('/login')
		.post(controller.login);
	
	router.route('/list_users')
		.get(auth.verifyToken, auth.validateRoleAdminAndSuperAdmin, controller.list_users);

	router.route('/logout')
		.post(auth.verifyToken, controller.logout);

	router.route('/get_user_data')
		.get(auth.verifyToken, controller.get_user_data);

		
    return router;
}