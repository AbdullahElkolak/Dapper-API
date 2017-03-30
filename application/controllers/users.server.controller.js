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

function createID(possible, name) {
    for(var i = 0; i < 12; i++) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return name;
}

exports.avatarUpload = function(req, res) {
	// use the user object to identify corresponding user via the user id
    var user = req.user;

    var busboy = new Busboy({ headers: req.headers });
    var ext = '', possiblename = '';

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        ext = path.extname(filename).toLowerCase();

        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
            imgID = createID(possible, possiblename) + ext;

        while(Images.checkImageID(imgID)) {
            imgID = createID(possible, possiblename) + ext;
        }

		// Store the avatars in the Profile folder within the uploads
        var saveTo = path.join('./uploads/profile', imgID);

		// Get the avatar name
        user.Avatar = imgID;
		
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

        user.save(function(err) {
            if(err) {
                return 'Error occurred in the Avatar upload controller';
            } else return res.json(user);
        });

    });

    return req.pipe(busboy);
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
                if (err) {
                    return next(err);
                } else { 
					return res.json(user);;
				}
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
                message: "Username is already in use",
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