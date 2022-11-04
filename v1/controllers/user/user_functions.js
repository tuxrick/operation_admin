//Tools
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Models 
const user = require('../../models/user');
const expired_token = require('../../models/expired_token');

module.exports = {
	    
    generateHashPassword: async (pass) =>{
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(pass, salt);
        return password;
    },

    generateUserToken: async (user_data) => {
        const token = jwt.sign({
            _id: user_data._id,
            name: user_data.first_name,
            email: user_data.last_name,
            role: user_data.role
        }, process.env.TOKEN_SECRET);        

        return token;
    },

    updateUserToken: async (user_id, token) => {
    
        let updated_user = user.findOneAndUpdate({_id: user_id}, {token:token}, {new: true});
        return updated_user;
        
    },    

    getExpiredToken: async (token) => {
        let expired_token_data = await expired_token.findOne({ token:token });
        return expired_token_data;
    },

    addExpiredToken: async (user_id, token) => {
    
        const token_data = new expired_token({
            id_user: user_id,
            token: token
        });
        const saved_expired_token = await token_data.save();
        return saved_expired_token;

    },        

    listUsers: async (user_info) => {
        try{
            const data = user.find({});
            return data;
        }catch{
            return false;
        }
    },


    createUser: async (user_info) => {
        try{
            const user_data = new user(user_info);
            const saved_user = await user_data.save();
            return saved_user;
        }catch{
            return false;
        }
    },

    getUserById: async (user_id) => {
        const user_data = await user.findOne({_id:user_id});
        return user_data;
    },

    getUserByEmail: async (user_email) => {
        const user_data = await user.findOne({email:user_email});
        return user_data;
    },

    updateUser: async (user_info) => { 
        try{
            let updated_user = user.findOneAndUpdate({_id: user_info._id}, user_info, {new: true});
            return updated_user;
        }catch{
            return false;
        }
    }    
}