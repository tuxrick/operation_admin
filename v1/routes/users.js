const { func } = require('@hapi/joi');
const controller = require('../controllers/user/index');
const verifyToken = require('../utils/authorization').verifyToken;

module.exports = (router) => {

	router.route('/register')
		.post(controller.register);
	
	router.route('/login')
		.post(controller.login);
	
	router.route('/list_users')
		.get(verifyToken, controller.list_users);

	router.route('/logout')
		.post(verifyToken, controller.logout);

	router.route('/get_user_data')
		.get(verifyToken, controller.get_user_data);

		
    return router;
}