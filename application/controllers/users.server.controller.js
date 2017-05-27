/**
 * User actions controller file
 * Created by Kudzai Gopfa on 3/5/2017.
 */

var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');
var mongoose = require('mongoose');
var User = mongoose.model('Users');

// authentication modules
var jwt = require('jsonwebtoken');


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

// Create ID for user avatar
function createID(possible, name) {
    for(var i = 0; i < 12; i++) {
        // Generate random ID
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
}

// Avatar upload function
exports.avatarUpload = function(req, res) {
	// use the user object to identify corresponding user via the user id
    var user = req.user;

    var busboy = new Busboy({ headers: req.headers });
    var ext = '', possiblename = '';

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        ext = path.extname(filename).toLowerCase();

        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
            imgID = createID(possible, possiblename) + ext;

		// Store the avatars in the Profile folder within the uploads
        var saveTo = path.join('./uploads/profile', imgID);

		// Get the avatar name
        user.avatar = imgID;

		// Update user object with avatar name
		user.save(function(err) {
			if(err)
				return res.send(
				{
					message: getErrorMessage(err),
					continue: false
				});
			else return res.send(
				{
					message: 'Avatar successfully updated',
					continue: true
				});
		});

        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', function() {
        console.log('Avatar Upload complete');
    });

    return req.pipe(busboy);
};

// Create user account
exports.createAccount = function(req, res) {
    // Check if a user is logged (see passport documentation on req.user)
    if(!req.user) {
        var user = new User(req.body);
        // Set the authentication method used
        user.provider = 'local';

        // Save user object
        user.save(function (err) {
            if(err) {
                return res.send({message: getErrorMessage(err)});
            } else {
                // Create user token if user account was created
                var token = user.generateJWT();
                return res.send({
                    message: "User token created",
                    UserContinue: true,
                    token: token
                });
            }//return res.redirect('/api/user/avatar');
        });
    }
};

// Check if a user is logged in
exports.confirmLogin = function(req, res, next) {
    if(!req.isAuthenticated()) {    // see passport documentation
        return res.status(401).send('User not logged in');
    }
    next();
};

// Render the signup page
exports.renderSignup = function(req, res) {
    res.render('signup', {
        title: 'Create account',
        message: req.flash('error') || req.flash('info')
    });
};

exports.renderAvatarUpload = function(req, res) {
    res.render('uploadAvatar');
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
                message: "Username is already in use",
                UserContinue: false
            });
        } else return res.send({
            message: "Continue",
            UserContinue: true
        });
    });
};

exports.UserLogin = function(req, res) {
    // User key can either be email or username
    if(req.body.userKEY && req.body.password) {
        var userKEY = req.body.userKEY;
        var password = req.body.password;
    }

    // Check whether user provides email or username
    var criteria = (userKEY.indexOf('@') === -1) ? {username: userKEY} :
    {email: userKEY};
    User.findOne(criteria, function(err, user){
        if (err) { // Check if an error occurs
            return res.send({
                message: getErrorMessage(err),
                UserContinue: false
            });
        }
        // If a user exists check password and return token
        else if (user.authenticate(password)) {
            // Create user token
            var token = user.generateJWT();
            return res.send({
                message: "User token created",
                UserContinue: true,
                token: token
            });
        } else return res.status(401).send({
            message: "Incorrect username/email and password combination!",
            UserContinue: false
        });
    });
};

exports.LogoutUser = function(req, res) {
    req.logout();
    res.redirect('/');
};

// Create token check method
