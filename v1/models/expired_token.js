const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        min: 6
    },
    id_user:{
        type: String,
        required: true,
        min: 1
    }
})

module.exports = mongoose.model('expired_tokens', Schema);