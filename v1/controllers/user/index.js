const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//User functions
const user_functions = require('./user_functions');

//Utils
const requests = require('../../utils/requests');

//Models
const User = require('../../models/user');


module.exports = {
	    
    register: async (req, res) => {

        let user_password = req.body.password;

        const schemaRegister = Joi.object({
            name: Joi.string().min(3).max(255).required(),
            email: Joi.string().min(4).max(255).required().email(),
            password: Joi.string().min(6).max(1024).required()
        })

        // validate user
        const { error } = schemaRegister.validate(req.body);
        
        if (error) {
            return requests.error_response(req, res, error, error.details[0].message );
        }

        const isEmailExist = await User.findOne({ email: req.body.email });
        if (isEmailExist) {
            return requests.error_response(req, res, "", "Email already exists" );
        }    

        // hash password
        const password = await user_functions.generateHashPassword(user_password);
        try {

            const user = await user_functions.createUser({
                name: req.body.name,
                email: req.body.email,
                password: password,
                role: "user",
                token: "temp"
            });

            const token = await user_functions.generateUserToken(user);

            const updated_user = await user_functions.updateUserToken(user._id, token);
    
            return requests.success_response(req, res, 
                {
                    email: updated_user.email,
                    name: updated_user.name,
                    role: updated_user.role,
                    token: updated_user.token
                }, 
                "Successful request");

        } catch (error) {
            return requests.error_response(req, res, "", "Error creating user" );
        }        
    },

    login: async (req, res) => {            
        
        let user_info = {
            email : req.body.email,
            password : req.body.password
        }

        const schemaLogin = Joi.object({
            email: Joi.string().min(6).max(255).required().email(),
            password: Joi.string().min(6).max(1024).required()
        })
        
        const { error } = schemaLogin.validate(user_info);
        
        if (error) {
            return requests.error_response(req, res, "", "Email already exists" );
        }
        
        try{
            const user = await user_functions.getUserByEmail(user_info.email);

            if (!user) {
                return requests.error_response(req, res, "", "User not found" );
            }   

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return requests.error_response(req, res, "", "Invalid password" );
            }    

            //Expire token
            const addExpiredToken = await user_functions.addExpiredToken(user._id, user.token);

            //Generate new token
            const token = await user_functions.generateUserToken(user);
            // Update user token
            const user_updated = await user_functions.updateUserToken(user._id, token);
            
            return requests.success_response(req, res, 
                {
                    email:user_updated.email,
                    name: user_updated.name,
                    token: user_updated.token
                }, 
                "Successful request");
        }catch{
            return requests.error_response(req, res, "", "Error logging in user" );
        }
        
    },    

    list_users: async (req, res) => {

        const users = await User.find({});
        return requests.success_response(req, res, users, "Successful request");

    },

    logout: async (req, res) => {
        const user_info = req.decoded; 
        const token = req.token; 

        const expired_token_exists = await user_functions.getExpiredToken(token);

        if (expired_token_exists) {
            return requests.success_response(req, res, "", "User already logged out");
        } 
        
        try {
            const saved_expired_token = user_functions.addExpiredToken(user_info._id, token);
            return requests.success_response(req, res, saved_expired_token, "Successful request");
        } catch (error) {
            return requests.error_response(req, res, "", "Error at logout" );
        }        

    },  
    
    get_user_data: async (req, res) => {
        let user_info = req.decoded;
        try {

            const user = await user_functions.getUserById(user_info._id);
        
            const user_data = {
                id:user._id,
                name:user.name,
                //email:user.email
            };

            return requests.success_response(req, res, user_data, "Successful request");
        } catch (error) {
            return requests.error_response(req, res, "", "Error getting user data" );
        }
    }, 

}