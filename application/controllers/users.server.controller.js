var mongoose = require('mongoose');
var User = mongoose.model('Users');
var passport = require('passport');

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }
    return message;
};

exports.createAccount = function(req, res, next) {
    if(!req.user) {
        var user = new User(req.body);

        user.provider = 'local';

        user.save(function (err) {
            if (err) {
                var message = getErrorMessage(err);

                return res.send(message);
            } else req.login(user, function (err) {
                if (err)
                    return next(err);
                else return res.send(user);
            });
        });
    } else {
        res.send("This user already exists");
    }
};

exports.confirmLogin = function(req, res, next) {
    if(!req.isAuthenticated()) {
        return res.status(401).send('User not logged in');
    }
    next();
};

exports.renderSignup = function(req, res) {
    res.render('signup', {
        title: 'Create account',
        message: req.flash('error') || req.flash('info')
    });
};

exports.renderSignin = function(req, res) {
    res.render('signin', {
        title: 'Login',
        message: req.flash('error') || req.flash('info')
    });
};

exports.DeleteAccount = function(req, res) {
    var user = req.user;

    user.remove(function(err) {
        if(err) {
            req.flash('error', getErrorMessage(err));
            return res.redirect('/Profile/:userId');
        } else {
            req.logout();
            res.redirect('/');
        }
    });
};

exports.CheckIfEmailInUse = function(req, res) {
    var email = req.body.email;
    User.findOne({
        email: email.toLowerCase()
    }, function(err, user) {
        if (err) {
            return 'An error occurred, Please Try Again';
        } else if (user) {
            // return true if a username is taken
            return res.send({
                message: "Email is already in use",
                UserContinue: false
            });
        } else return res.send({
            message: "Continue",
            UserContinue: true
        });
    });
};

exports.CheckIfUsernameAvailable = function(req, res) {
    var username = req.body.username;
    User.findOne({
        username: username.toLowerCase()
    }, function(err, user) {
        if (err) {
            var message = getErrorMessage(err);
            return res.send(message);
        } else if (user) {
            // return true if a username is taken
            return res.send({
                message: "Email is already in use",
                UserContinue: false
            });
        } else return res.send({
            message: "Continue",
            UserContinue: true
        });
    });
};

exports.LogoutUser = function(req, res) {
    req.logout();
    res.redirect('/');
};