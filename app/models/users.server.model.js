/**
* User model definition.
* Created by Kudzai Gopfa on 3/6/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const mongoose   =  require('mongoose');
const crypto     =  require('crypto');
const jwt        =  require('jsonwebtoken');
const config     =  require('../../config/env/development.js');
const Schema     =  mongoose.Schema;

let UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    avatar: {
        type: String,
        default: 'https://heatherchristenaschmidt.files.wordpress.com/2011/09/facebook_no_profile_pic2-jpg.gif'
    },
    bio: String,
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        format: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email address!']
    },
    password: {
        type: String,
        min: [6, 'Password must contain at least six characters'],
        required: true
    },
    salt: String,
    provider: {
        type: String,
        required: true
    },
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

UserSchema.pre('save', function(next) {
    if(this.password) {
        this.salt = new Buffer(crypto.randomBytes(48).toString(), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Users', UserSchema);
