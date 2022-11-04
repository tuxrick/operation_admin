const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: false,
        minlength: 4
    },
    token: {
        type: String,
        required: false,
    }
})

module.exports = mongoose.model('User', userSchema);