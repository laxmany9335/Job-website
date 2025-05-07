const { Password } = require('@mui/icons-material');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Password:{
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }

});