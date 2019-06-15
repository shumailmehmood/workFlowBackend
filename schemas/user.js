const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
    ,
    file_name: {
        type: String,
    
        default:''
    },
    file_path: {
        type: String,
       
        default:''
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
    ,
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    timeIn:
    {
        type: String,
        required: true
    },
    timeOut:
    {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
    ,
    isAdmin: Boolean,
    accountStatus:
    {
        type: String,
        required: true,
        default: 'deactive'

    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    secretToken:
    {
        type: String,
    }
});

userSchema.methods.generateToken = function () {
    const token = (jwt.sign({ id: this._id, name: this.name, designation: this.designation, email: this.email, isAdmin: this.isAdmin }, ('jwtPrivateKey')));
    return token;
}
module.exports = mongoose.model('User', userSchema);
