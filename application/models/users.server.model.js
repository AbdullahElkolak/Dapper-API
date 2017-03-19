var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
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
    }
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
    return crypto.pbkdf2Sync(password, this.salt, 10000,64).toString('base64');
};

UserSchema.statics.checkEmail = function(email) {
    this.findOne({
        email: email
    }, function(err, user) {
        if(err) {
            return 'An error occurred, Please Try Again';
        } else if(user) {
            return false;
        } else return true;
    });
};

UserSchema.statics.checkUsername = function(username) {
    this.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return 'An error occurred, Please Try Again';
        } else if (user) {
            return false;
        } else return true;
    });
};

mongoose.model('Users', UserSchema);