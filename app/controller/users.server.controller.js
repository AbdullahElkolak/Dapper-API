var User = require('mongoose').model('User');
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

exports.CreateAccount = function(req, res, next) {
    if(!req.user) {
        var user = new User(req.body);
        user.provider = 'local';

        var message = null;

        user.save(function (err) {
            if (err) {

                var message = getErrorMessage(err);

                req.flash('error', message);
                //next(err);
                return res.redirect('/signup');
            } else req.login(user, function(err) {
                if(err)
                    return next(err);
                return res.redirect('/posts');
            });
        });
    } else {
        res.redirect('/');
    }
};

exports.CheckLogin = function(req, res, next) {
    if(!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User not logged in'
        });
    }
    next();
};

exports.ReadProfile = function(req, res) {
    res.json(req.user);
};

exports.UpdateAccount = function(req, res) {
    var user = req.user;

    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function(err) {
        if(err) {
            req.flash('error', getErrorMessage(err));
            return res.redirect('/Profile/:userId');
        } else {
            res.json(req.user);
            res.redirect('/Profile/:userId', {
                message: 'Profile Updated'
            });
        }
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

exports.LogoutUser = function(req, res) {
    req.logout();
    res.redirect('/');
};