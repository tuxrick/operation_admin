const { func } = require('@hapi/joi');
const controller = require('../controllers/user/index');
const auth = require('../utils/authorization');

module.exports = (router) => {

	router.route('/register')
		.post(controller.register);

	router.route('/create_user')
		.post(auth.verifyToken, auth.validateRoleAdminAndSuperAdmin, controller.createUser);

	router.route('/update_user')
		.post(auth.verifyToken, controller.updateUser);		

	router.route('/login')
		.post(controller.login);
	
	router.route('/list_users')
		.get(auth.verifyToken, auth.validateRoleAdminAndSuperAdmin, controller.listUsers);

	router.route('/logout')
		.post(auth.verifyToken, controller.logout);

	router.route('/get_user_data')
		.get(auth.verifyToken, controller.getUserData);

		
    return router;
}